"use client"
import VideoPlayerPage from "../../../components/POVlib/VideoPlayerPage";
import { getDemoById } from "../../../lib/supabase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingFullscreen } from "../../../components/loading/LoadingFullscreen";

export default function Test({ params }) {
  const { demo_id } = React.use(params);
  const [demo, setDemo] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemo = async () => {
      const demo = await getDemoById(demo_id);
      setDemo(demo);
    }
    fetchDemo();
  },[]);

  useEffect(() => {
    if (demo != null) {
      setLoading(false);
    }
  },[demo])

  if (!demo) return <LoadingFullscreen />

  return !loading ? (
    <VideoPlayerPage 
      selectedDemo={demo} 
      onClose={() => router.back()}
      onLike={() => console.log("Like")}
      onOpenTagModal={() => console.log("Modal")}
    />
  ) : (
    <LoadingFullscreen />
  )
}