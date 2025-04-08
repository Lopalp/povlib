"use client"
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton =  ({ text }) => {

    const router = useRouter();

    return (
        <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-yellow-400 mb-4 transition-colors cursor-pointer"
            style={{cursor: "pointer"}}
        >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">{text}</span>
        </button>
    );
};

export default BackButton; 