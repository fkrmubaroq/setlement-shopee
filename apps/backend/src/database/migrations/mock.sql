
-- Mock / seed data (development)
INSERT INTO brand (id, nama_brand) VALUES
  (1, 'Toko Contoh A'),
  (2, 'Brand Demo Shopee')
ON DUPLICATE KEY UPDATE nama_brand = VALUES(nama_brand);

INSERT INTO users (id, name, email, password, avatar, phone) VALUES
  (1, 'Admin Demo', 'admin@demo.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, '081234567890'),
  (2, 'User Uji', 'user@demo.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, '089876543210')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

INSERT INTO data_shopee (id_brand, dari_tanggal, sampai_tanggal, shopee_penghasilan_saya, shopee_pesanan_saya, shopee_biaya_iklan, variasi_1, variasi_2, orders_reference_column) VALUES
  (1, '2025-03-01', '2025-03-15', '15000000', '320', '850000', 'Campuran', 'Reguler', 'ORD-REF-001'),
  (1, '2025-03-16', '2025-03-27', '18500000', '410', '920000', NULL, NULL, NULL),
  (2, '2025-03-01', '2025-03-27', '8200000', '155', '310000', 'Satuan', NULL, 'ORD-REF-002');

INSERT INTO hpp_produk (id_brand, nama_produk, hpp, variasi_1, variasi_2) VALUES
  (1, 'Produk Best Seller A', '45000', 'Merah', 'M'),
  (1, 'Produk Bundle B', '120000', NULL, NULL),
  (2, 'Item Demo C', '28000', 'Biru', NULL);