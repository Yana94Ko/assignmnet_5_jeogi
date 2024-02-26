import { NotFoundException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

const RANDOM_ID_BASE = process.env.RANDOM_ID_BASE;
if (!RANDOM_ID_BASE) throw new NotFoundException('No RANDOM_ID_BASE');

const generateRandomId = customAlphabet(RANDOM_ID_BASE, 20);

export default generateRandomId;
