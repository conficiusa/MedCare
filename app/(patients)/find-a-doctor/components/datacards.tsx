import DocCardOnline from "@/components/blocks/DocCardOnline";
import { fetchDoctorCardData } from "@/lib/queries";
import React from "react";
import NotFound from "../not-found";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface propTypes {
  query?: string;
  page?: string;
  show_all?: string;
}

const Datacards = async ({ searchParams }: { searchParams?: propTypes }) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const showall = Boolean(searchParams?.show_all) || false;

  const ITEMS_PER_PAGE = 10;

  const queryOptions = {
    filter: {
      "doctorInfo.verification": "approved",
    },
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    sort: {
      "doctorInfo.rating": -1 as const,
      "doctorInfo.rate": 1 as const,
    },
  };
  
  const data = await fetchDoctorCardData(queryOptions, query, showall);

  if ("error" in data) {
    if (data?.statusCode === 404) {
      return <NotFound search={query} />;
    }
    return <div>{data.message}</div>;
  }

  const totalDoctors = data.totalDoctors || 0;
  const totalPages = Math.ceil(totalDoctors / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, totalDoctors);

  return (
    <div className="flex flex-col gap-8">
      {query && (
        <div className="text-sm text-muted-foreground">
          Found {totalDoctors} {totalDoctors === 1 ? 'doctor' : 'doctors'} 
          {query ? ` for "${query}"` : ''}
        </div>
      )}
      
      {!query && totalDoctors > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {startIndex}-{endIndex} of {totalDoctors} doctors
        </div>
      )}
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        <DocCardOnline className="shadow-sm border-[1px]" doctors={data?.data} />
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?query=${query}&page=${currentPage - 1}${showall ? '&show_all=true' : ''}`} />
              </PaginationItem>
            )}
            
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              
              // Show first page, current page, last page, and one page before and after current
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href={`?query=${query}&page=${pageNumber}${showall ? '&show_all=true' : ''}`}
                      isActive={pageNumber === currentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              
              // Add ellipsis for breaks in sequence
              if (pageNumber === 2 || pageNumber === totalPages - 1) {
                return (
                  <PaginationItem key={i}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              
              return null;
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?query=${query}&page=${currentPage + 1}${showall ? '&show_all=true' : ''}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Datacards;
