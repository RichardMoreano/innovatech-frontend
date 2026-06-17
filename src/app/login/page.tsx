'use client';

import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            InnovaTech v2
          </h2>
          <p className="mt-2 text-sm text-zinc-400">Ingresa a tu panel de control de proyectos</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}