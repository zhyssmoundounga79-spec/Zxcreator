const apiCall = async (endpoint: string, body: any) => {
  const response = await fetch(`/api/ai/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Generation failed');
  }
  return response.json();
};

export const generateIdeas = async (niche: string, platform: string, goal: string) => {
  const data = await apiCall('generate-ideas', { niche, platform, goal });
  return data.ideas ? { ...data, result: data.ideas } : data; // Maintain compatibility if needed, but better to return { ideas, newBalance }
};

export const generateHooks = async (topic: string, niche: string) => {
  const data = await apiCall('generate-hooks', { topic, niche });
  return data.hooks ? { ...data, result: data.hooks } : data;
};

export const generateScript = async (topic: string, niche: string, platform: string, length: string, tone: string) => {
  const data = await apiCall('generate-script', { topic, niche, platform, length, tone });
  return data.script ? { ...data, result: data.script } : data;
};

export const generateThumbnails = async (topic: string, niche: string) => {
  const data = await apiCall('generate-thumbnails', { topic, niche });
  return data.thumbnails ? { ...data, result: data.thumbnails } : data;
};

export const generateHashtags = async (topic: string, niche: string) => {
  const data = await apiCall('generate-hashtags', { topic, niche });
  return data.hashtags ? { ...data, result: data.hashtags } : data;
};

export const generateVideo = async (prompt: string, duration: string, aspectRatio: string, resolution: string, music: string) => {
  const data = await apiCall('generate-video', { prompt, duration, aspectRatio, resolution, music });
  return data.videoUrl ? { ...data, result: data.videoUrl } : data;
};
