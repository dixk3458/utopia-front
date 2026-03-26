import { createBrowserRouter, redirect } from 'react-router';
import App from './App';
import AppShell from './AppShell';

import Landing from './pages/landing/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SocialCallback from './pages/SocialCallback';
import Favor from './pages/Favor';
import HandOcrCaptcha from './pages/hand-ocr-captcha/HandOcrCaptcha';
import Chat from './pages/Chat';

import Profile from './pages/Profile';
import Report from './pages/Report';
import Party from './pages/Party';
import Home from './pages/Home';

import Me from './pages/mypage/Me';
import MyParty from './pages/mypage/MyParty';
import MyHistory from './pages/mypage/MyHistory';
import MyReport from './pages/mypage/MyReport';
import MyPayment from './pages/mypage/MyPayment';

const router = createBrowserRouter([
  // ── 1. 풀스크린 레이아웃 그룹 (Header + Footer, Sidebar 없음) ──
  {
    path: '/',
    Component: App,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: 'login',
        Component: Login,
      },
      {
        path: 'signup',
        Component: Signup,
      },
      {
        path: 'favor',
        Component: Favor,
      },
      {
        path: 'handcaptcha',
        Component: HandOcrCaptcha,
      },
      {
        path: 'oauth/callback/:provider',
        Component: SocialCallback,
      },
      {
        path: 'party/:partyId/chat',
        Component: Chat,
      },
    ],
  },

  // ── 2. 사이드바 + 헤더 레이아웃 그룹 (AppShell) ──
  {
    path: '/',
    Component: AppShell,
    children: [
      {
        // ✅ Fix: Home을 AppShell 레이아웃으로 이동 (내부에서 Sidebar/Header 직접 렌더링하지 않음)
        path: 'home',
        Component: Home,
      },
      {
        path: 'profile/:userId',
        Component: Profile,
      },
      {
        path: 'report',
        Component: Report,
      },
      {
        path: 'party/:partyId',
        Component: Party,
      },
      {
        path: 'mypage',
        Component: Me,
        children: [
          {
            index: true,
            loader: () => redirect('/mypage/profile'),
          },
          {
            path: 'profile',
            Component: Profile,
          },
          {
            path: 'party',
            Component: MyParty,
          },
          {
            path: 'history',
            Component: MyHistory,
          },
          {
            path: 'report',
            Component: MyReport,
          },
          {
            path: 'payment',
            Component: MyPayment,
          },
        ],
      },
    ],
  },
]);

export default router;
