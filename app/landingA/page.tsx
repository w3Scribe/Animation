'use client';

import Button from '@/app/landingA/Button';
import Label from '@/app/landingA/Label';
import Navbar from '@/app/landingA/Navbar';
import { HeartPulse, Star } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="my-12 grid grid-cols-2 items-center justify-items-end gap-6 px-24">
        {/* left container */}
        <div className="flex flex-col items-start">
          <Label className="relative inline-flex items-center gap-1 justify-self-start rounded-full bg-green-200/75 px-3 py-0.5 text-xs text-green-700 capitalize">
            <HeartPulse size={12} />
            100% Health Guaranteed
          </Label>

          <h1 className="mt-4 text-5xl leading-12 font-bold text-balance text-gray-800">
            Transforming the Future of Healthcare with{' '}
            <span className="font-black text-green-500">GCHealth</span>
          </h1>

          <p className="mt-4 text-base text-gray-600">
            Book appointments, track your wellness, and stay connected with
            expert care - all in one app.
          </p>

          <div className="mt-4 space-x-2">
            <Button style="primary">Start Free Trial</Button>
            <Button style="secondary">Watch Demo</Button>
          </div>

          {/* star rating */}
          <div className="mt-8">
            <p className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Static 5-star icon list
                  <Star key={i} size={16} className="text-yellow-400" />
                ))}
              </span>
              <span>
                Rated <span className="text-green-500">4.9</span>/5 From over
                950 reviews
              </span>
            </p>
          </div>
        </div>

        {/* right container */}
        <div className="flex">
          {/* Additional content can go here */}
          <Image
            src="/heath.jpg"
            alt="jpg"
            width={400}
            height={330}
            className="justify-self-end rounded-md"
          />
        </div>
      </main>
    </>
  );
}
