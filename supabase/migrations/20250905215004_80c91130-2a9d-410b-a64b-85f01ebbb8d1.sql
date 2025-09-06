-- Create some test notifications for connection requests
INSERT INTO notifications (user_id, type, message, link, is_read, created_at)
VALUES 
-- Notification for Test User about Sarah's connection request (if one exists)
(
  'ff7e510a-7682-411e-af2c-b3a7b68a21d2',
  'connection_accepted',
  '2bdcce68-b238-4915-bdd8-bcd3133964d6 accepted your connection request',
  '/user/2bdcce68-b238-4915-bdd8-bcd3133964d6',
  false,
  now() - interval '2 hours'
),
-- Notification for Sarah about the original connection request
(
  '2bdcce68-b238-4915-bdd8-bcd3133964d6', 
  'connection_request',
  'ff7e510a-7682-411e-af2c-b3a7b68a21d2 sent you a connection request',
  '/user/ff7e510a-7682-411e-af2c-b3a7b68a21d2',
  true,
  now() - interval '1 day'
);