'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useCallback, useEffect, useState, useRef } from 'react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useDebounce } from '@/hooks/use-debounce';
import { IUser, useUsersStore } from '@/store/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchCache } from '@/hooks/use-search-cache';

interface Props {}

interface IResponseData {
  users: IUser[];
  limit: number;
  total: number;
}

export function SearchInput({}: Props) {
  const cache = useSearchCache();

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const lastQueryRef = useRef<string>('');

  const searchParams = useSearchParams();
  const router = useRouter();

  const updateUsers = useUsersStore((state) => state.updateUsers);

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
  }, []);

  const handleClearInput = useCallback(() => {
    setInputValue('');
    updateUsers([]);
    lastQueryRef.current = '';
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    router.replace(`?${params.toString()}`);
  }, [updateUsers, searchParams, router]);

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    const abort = new AbortController();

    (async () => {
      const query = debouncedValue.trim();

      if (!query || query.length < 3) {
        if (lastQueryRef.current) {
          lastQueryRef.current = '';
          const params = new URLSearchParams(searchParams);
          params.delete('q');
          router.replace(`?${params.toString()}`);
        }
        return;
      }

      if (query === lastQueryRef.current) {
        return;
      }

      if (cache.hasFresh(query)) {
        updateUsers(cache.get(query)!);
        lastQueryRef.current = query;
        const params = new URLSearchParams(searchParams);
        params.set('q', query);
        router.replace(`?${params.toString()}`);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: abort.signal,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API status (${response.status}): ${text}`);
        }

        const data = (await response.json()) as IResponseData;

        if (data) {
          updateUsers(data.users);

          cache.set(query, data.users);
          
          lastQueryRef.current = query;
          const params = new URLSearchParams(searchParams);
          params.set('q', query);
          router.replace(`?${params.toString()}`);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      abort.abort();
    };
  }, [debouncedValue, updateUsers]);

  return (
    <div className="relative w-full h-9">
      <Input
        placeholder="Start typing (minimum 3 characters), results will appear automatically."
        value={inputValue}
        onChange={handleInput}
        className="absolute"
      />
      {isLoading && <Spinner variant="circle" className="absolute h-9 right-10" />}
      <Button
        onClick={handleClearInput}
        className="absolute right-0 bg-transparent text-black hover:text-white cursor-pointer">
        x
      </Button>
    </div>
  );
}
