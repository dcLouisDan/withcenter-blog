"use client";

import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PER_PAGE_DEFAULT } from "@/lib/constants";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function PaginationBar({
  total = 0,
  page = 1,
  size = PER_PAGE_DEFAULT,
}: {
  total?: number;
  page?: number;
  size?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const createPageLinkString = useCallback(
    (page: number) => {
      return pathname + "?" + createQueryString("page", page.toString());
    },
    [pathname],
  );

  const { pages, isFirstPage, isLastPage, nextPage, prevPage, lastPage } =
    useMemo(() => {
      const pages: number[] = [];
      const lastPage = Math.max(Math.ceil(total / size), 1);
      const isFirstPage = page === 1;
      const isLastPage = page === lastPage;
      const prevPage = Math.max(page, page - 1);
      const nextPage = Math.min(lastPage, page + 1);

      const delta = isFirstPage || isLastPage ? 2 : 1;
      const startPage = Math.max(1, page - delta);
      const endPage = Math.min(lastPage, page + delta);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return { pages, isFirstPage, isLastPage, nextPage, lastPage, prevPage };
    }, [page, total, size]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            href={createPageLinkString(1)}
            disabled={isFirstPage}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            href={createPageLinkString(prevPage)}
            disabled={isFirstPage}
          />
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              isActive={pageNumber == page}
              href={createPageLinkString(pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            disabled={isLastPage}
            href={createPageLinkString(nextPage)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            disabled={isLastPage}
            href={createPageLinkString(lastPage)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
