import dotenv from 'dotenv';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/schema';

dotenv.config();

const { ACCESS_SECRET, REFRESH_SECRET} = process.env;

const authRouter = Router();

async function getUser(email: string){
  const user = await UserModel.findOne({ email });
  return user;
}

function signAccessToken(payload: any){
  return jwt.sign(payload, ACCESS_SECRET as string, { expiresIn: '10m' });
}

function signRefreshToken(payload: any){
  return jwt.sign(payload, REFRESH_SECRET as string, { expiresIn: '7d' });
}

authRouter.post('/signup', async (req, res) => {
  console.log('signup')
  const { email, password } = req.body;
  const user = await getUser(email);
  if (user) {
    return res.status(403).send('Email is already signed up.');
  }
  const hashedPassword = await bcrypt.hash(password, 8);
  try{
    await UserModel.create({ email, password: hashedPassword });
    res.status(200).send('User signed up successful');
  }
  catch(e){
    console.log("signup error :" + e)
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email);
  if (!user) {
    return res.status(401).send('This email not not signed up.');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send('Invalid credentials.');
  }

  const payload = { id: user._id.toString(), email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  try{
  await UserModel.findByIdAndUpdate(user._id, { refreshToken });
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 10 * 60 * 1000
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(200).send('Login successful');
}
catch(e){
  console.log("login error " + e)
}
});

authRouter.post('/refresh', async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).send('No refresh token');

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET as string) as any;
    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).send('Invalid refresh token');
    }

    const payload = { id: user._id.toString(), email: user.email };
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken(payload);

    await UserModel.findByIdAndUpdate(user._id, { refreshToken: newRefresh });

    res.cookie('access_token', newAccess, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 10 * 60 * 1000
    });
    res.cookie('refresh_token', newRefresh, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).send('Refreshed');
  } catch {
    res.status(403).send('Invalid refresh token');
  }
});

authRouter.post('/logout', async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET as string) as any;
      await UserModel.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
    } catch {}
  }
  res.clearCookie('access_token', { httpOnly: true, sameSite: 'none', secure: true });
  res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'none', secure: true });
  res.status(200).send('Logged out');
});

export default authRouter;
