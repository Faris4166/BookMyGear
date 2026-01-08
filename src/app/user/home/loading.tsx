import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

function ItemSkeleton() {
    return (
        <Card className="border-none shadow-md flex flex-col bg-card">
            <Skeleton className="aspect-[16/10] w-full rounded-t-xl" />
            <CardHeader className="space-y-2 pb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="flex-grow pb-4">
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
                <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
        </Card>
    )
}

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
            <div className="space-y-1">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <Skeleton className="h-10 w-full md:w-96 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                    <ItemSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}
