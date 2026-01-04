INSERT INTO users ("firstName", "lastName", email, "passwordHash", role, "isActive")
VALUES ('Test', 'User', 'test@test.com', '$2b$10$uBpl4uXGmMyZi.RJJ/SGv.zZuOX9i8LGFKaM3afBqMd34jeLHh/.C', 'ADMIN', true)
ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash";
