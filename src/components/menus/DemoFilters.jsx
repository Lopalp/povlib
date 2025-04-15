"use client"
import React, { useState } from 'react';
import { Search, Filter, X, Menu } from 'lucide-react';
import Link from 'next/link';
import { useDemos } from '@/context/DemoProvider';

const DemoFilters = ({ dynamicTags, handleTagClick }) => {

    const demos = useDemos();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    return (
        <div className="flex items-center gap-2 mb-2">
            <Filter
                onClick={() => setIsFilterModalOpen(true)}
                className="text-yellow-400 cursor-pointer"
            />
            <div className="flex flex-wrap items-center gap-2">
                {demos.dynamicTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => demos.handleTagClick(tag)}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-yellow-400/20 transition-colors"
                    >
                        {tag}
                    </button>
                ))}
                <Link href="/demos" className="text-yellow-400 text-sm underline">
                    Alle Demos
                </Link>
            </div>
        </div>
    );
};

export default DemoFilters;