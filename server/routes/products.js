// server/routes/products.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAuth, requireSupport } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
})

// GET /products - Listar productos activos (público)
router.get('/', (req, res) => {
  const sql = `
    SELECT p.*, 
           COALESCE(AVG(r.rating), 0) as avg_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN product_reviews r ON p.id = r.product_id
    WHERE p.active = 1
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error listando productos:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    res.json(rows);
  });
});

// GET /products/:id - Obtener producto con sus reviews (público)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sqlProduct = `
    SELECT p.*, 
           COALESCE(AVG(r.rating), 0) as avg_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN product_reviews r ON p.id = r.product_id
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.get(sqlProduct, [id], (err, product) => {
    if (err) {
      console.error('Error obteniendo producto:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Obtener reviews del producto
    const sqlReviews = `
      SELECT r.*, u.display_name, u.email
      FROM product_reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `;

    db.all(sqlReviews, [id], (err2, reviews) => {
      if (err2) {
        console.error('Error obteniendo reviews:', err2);
        return res.status(500).json({ error: 'Error interno' });
      }

      res.json({ ...product, reviews });
    });
  });
});

// GET /products/:id/reviews - Obtener reviews de un producto
router.get('/:id/reviews', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT r.*, u.display_name, u.email
    FROM product_reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;

  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error obteniendo reviews:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    res.json(rows);
  });
});

// POST /products/:id/reviews - Añadir review (requiere auth)
router.post('/:id/reviews', requireAuth, (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'La valoración debe ser entre 1 y 5' });
  }

  // Verificar si el usuario ya ha valorado este producto
  const sqlCheck = 'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?';
  db.get(sqlCheck, [id, userId], (err, existing) => {
    if (err) {
      console.error('Error verificando review:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    if (existing) {
      // Actualizar review existente
      const sqlUpdate = `
        UPDATE product_reviews 
        SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP
        WHERE product_id = ? AND user_id = ?
      `;
      db.run(sqlUpdate, [rating, comment || null, id, userId], function (err2) {
        if (err2) {
          console.error('Error actualizando review:', err2);
          return res.status(500).json({ error: 'Error interno' });
        }
        res.json({ success: true, message: 'Valoración actualizada', id: existing.id });
      });
    } else {
      // Crear nueva review
      const sqlInsert = `
        INSERT INTO product_reviews (product_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `;
      db.run(sqlInsert, [id, userId, rating, comment || null], function (err2) {
        if (err2) {
          console.error('Error creando review:', err2);
          return res.status(500).json({ error: 'Error interno' });
        }
        res.status(201).json({ success: true, message: 'Valoración añadida', id: this.lastID });
      });
    }
  });
});

// DELETE /products/:id/reviews - Eliminar mi review
router.delete('/:id/reviews', requireAuth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = 'DELETE FROM product_reviews WHERE product_id = ? AND user_id = ?';
  db.run(sql, [id, userId], function (err) {
    if (err) {
      console.error('Error eliminando review:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Review no encontrada' });
    }
    res.json({ success: true, message: 'Valoración eliminada' });
  });
});

// GET /products/admin/all - Listar TODOS los productos (admin)
router.get('/admin/all', requireAuth, requireSupport, (req, res) => {
  const sql = `
    SELECT p.*, 
           COALESCE(AVG(r.rating), 0) as avg_rating,
           COUNT(r.id) as review_count
    FROM products p
    LEFT JOIN product_reviews r ON p.id = r.product_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error listando productos:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    res.json(rows);
  });
});

// POST /products - Crear producto (admin)
router.post('/', requireAuth, requireSupport, upload.single('image'), (req, res) => {
  const { name, description, brand, color, price } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const sql = `
    INSERT INTO products (name, description, image_url, brand, color, price)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, description || null, imageUrl, brand || null, color || null, price || 0], function (err) {
    if (err) {
      console.error('Error creando producto:', err);
      return res.status(500).json({ error: 'Error interno' });
    }

    // Devolver producto creado
    db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err2, product) => {
      if (err2) {
        return res.status(500).json({ error: 'Error interno' });
      }
      res.status(201).json(product);
    });
  });
});

// PUT /products/:id - Actualizar producto (admin)
router.put('/:id', requireAuth, requireSupport, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description, brand, color, price, active } = req.body;

  // Primero obtenemos el producto actual para la imagen
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      console.error('Error obteniendo producto:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let imageUrl = product.image_url;
    if (req.file) {
      // Si hay nueva imagen, eliminar la anterior si existe
      if (product.image_url && product.image_url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', product.image_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const sql = `
      UPDATE products 
      SET name = COALESCE(?, name),
          description = COALESCE(?, description),
          image_url = ?,
          brand = COALESCE(?, brand),
          color = COALESCE(?, color),
          price = COALESCE(?, price),
          active = COALESCE(?, active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const activeValue = active !== undefined ? (active === 'true' || active === true ? 1 : 0) : null;

    db.run(sql, [name, description, imageUrl, brand, color, price, activeValue, id], function (err2) {
      if (err2) {
        console.error('Error actualizando producto:', err2);
        return res.status(500).json({ error: 'Error interno' });
      }

      db.get('SELECT * FROM products WHERE id = ?', [id], (err3, updated) => {
        if (err3) {
          return res.status(500).json({ error: 'Error interno' });
        }
        res.json(updated);
      });
    });
  });
});

// PATCH /products/:id/toggle - Activar/desactivar producto (admin)
router.patch('/:id/toggle', requireAuth, requireSupport, (req, res) => {
  const { id } = req.params;

  const sql = 'UPDATE products SET active = NOT active, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error toggling producto:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    db.get('SELECT * FROM products WHERE id = ?', [id], (err2, product) => {
      if (err2) {
        return res.status(500).json({ error: 'Error interno' });
      }
      res.json(product);
    });
  });
});

// DELETE /products/:id - Eliminar producto (admin)
router.delete('/:id', requireAuth, requireSupport, (req, res) => {
  const { id } = req.params;

  // Primero obtenemos el producto para eliminar la imagen
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) {
      console.error('Error obteniendo producto:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar imagen si existe
    if (product.image_url && product.image_url.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar producto (las reviews se eliminan por CASCADE)
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, [id], function (err2) {
      if (err2) {
        console.error('Error eliminando producto:', err2);
        return res.status(500).json({ error: 'Error interno' });
      }
      res.json({ success: true, message: 'Producto eliminado' });
    });
  });
});

router.get('/:id/favorite', requireAuth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `SELECT id FROM favorites WHERE product_id = ? AND user_id = ?`;

  db.get(sql, [id, userId], (err, row) => {
    if (err) {
      console.error('Error obteniendo favorito:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }
    res.json(row);
  });
});

router.post('/:id/favorite', requireAuth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `INSERT INTO favorites (product_id, user_id) VALUES (?, ?)`;

  db.run(sql, [id, userId], function (err) {
    if (err) {
      console.error('Error añadiendo favorito:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    res.status(201).json({ success: true, message: 'Favorito añadido' });
  });
});

router.delete('/:id/favorite', requireAuth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const sql = `DELETE FROM favorites WHERE product_id = ? AND user_id = ?`;

  db.run(sql, [id, userId], function (err) {
    if (err) {
      console.error('Error eliminando favorito:', err);
      return res.status(500).json({ error: 'Error interno' });
    }
    else if (this.changes === 0) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Eliminado de favoritos' });
  });
});
module.exports = router;
