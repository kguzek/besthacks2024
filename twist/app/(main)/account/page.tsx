'use client';

import React from 'react'
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signInSchema } from '@/schemas';
import { loginUser } from '@/actions/login';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { useEffect, useRef, useState, useTransition } from 'react';

export default function page() {
  return (
    <div className='flex-grow h-4/6 flex items-start justify-center'>
            
    </div>
  )
}
