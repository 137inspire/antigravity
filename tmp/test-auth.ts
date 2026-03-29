import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@ecobitex.com';
  const password = 'admin-reset-2026';
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User NOT found');
    return;
  }
  
  const isCorrect = await bcrypt.compare(password, user.password || '');
  console.log(`Password for ${email} is correct: ${isCorrect}`);
}
main().finally(() => prisma.$disconnect());
