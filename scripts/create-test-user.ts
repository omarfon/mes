import * as bcrypt from 'bcrypt';

async function createTestUser() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('Usuario de prueba:');
  console.log('Email: test@test.com');
  console.log('Password:', password);
  console.log('\nPassword Hash para insertar en BD:');
  console.log(hashedPassword);
  
  console.log('\nSQL Query:');
  console.log(`
INSERT INTO users ("firstName", "lastName", email, "passwordHash", role, "isActive")
VALUES ('Test', 'User', 'test@test.com', '${hashedPassword}', 'ADMIN', true)
ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash";
  `);
}

createTestUser();
