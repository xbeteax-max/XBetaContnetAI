
import React, { useState, useRef, useEffect } from 'react';
import { ContentType, Post, MediaAsset } from '../types';
import { PLATFORMS } from '../constants';
import { generateCaption, generateImage, editImage, generateVideo, generateSpeech } from '../services/gemini';
import { 
  Sparkles, Send, Video, FileText, Play, CheckCircle, 
  Loader2, Calendar, Clock, Heart, MessageCircle, 
  Repeat, Share2, MoreHorizontal, Music, Bookmark, User,
  Image as ImageIcon, Upload, X as CloseIcon, Wand2,
  Volume2, Film, Maximize, Smartphone, Laptop, Key,
  Move, FolderOpen, Scissors, FastForward, Wand
} from 'lucide-react';

interface ComposerProps {
  onPost: (post: Post) => void;
  onSaveAsset: (asset: MediaAsset) => void;
  assets: MediaAsset[];
}

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square' },
  { id: '2:3', label: 'Portrait' },
  { id: '3:2', label: 'Landscape' },
  { id: '3:4', label: 'Classic' },
  { id: '4:3', label: 'Classic LS' },
  { id: '9:16', label: 'Story/Reel' },
  { id: '16:9', label: 'Wide' },
  { id: '21:9', label: 'Cinema' },
];

const Composer: React.FC<ComposerProps> = ({ onPost, onSaveAsset, assets }) => {
  const [type, setType] = useState<ContentType>('text');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'X']);
  
  // Modal states
  const [showLibrary, setShowLibrary] = useState(false);

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [isVideoEditing, setIsVideoEditing] = useState(false);
  const [isSpeechGenerating, setIsSpeechGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Advanced Tools States
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [imageAspectRatio, setImageAspectRatio] = useState('1:1');
  const [editPrompt, setEditPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoEditPrompt, setVideoEditPrompt] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [lastVideoRef, setLastVideoRef] = useState<any>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Asset States
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scheduling state
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('12:00');

  // Preview Platform
  const [previewPlatform, setPreviewPlatform] = useState<'X' | 'Instagram' | 'YouTube'>('X');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const aiCaption = await generateCaption(topic, type);
    setContent(aiCaption || '');
    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
    if (!topic) return;
    setIsImageGenerating(true);
    try {
      const url = await generateImage(topic, imageSize, imageAspectRatio);
      setUploadedImageUrl(url);
      
      // Auto-save to File System
      onSaveAsset({
        id: Math.random().toString(36).substr(2, 9),
        name: `${topic.slice(0, 15)}.png`,
        type: 'image',
        url,
        createdAt: new Date(),
        size: imageSize,
        aspectRatio: imageAspectRatio
      });

    } catch (e) {
      alert("Failed to generate image. Please ensure you've selected an API key.");
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleEditImage = async () => {
    if (!uploadedImageUrl || !editPrompt) return;
    setIsImageEditing(true);
    try {
      const url = await editImage(uploadedImageUrl, editPrompt);
      setUploadedImageUrl(url);
      setEditPrompt('');
    } catch (e) {
      alert("Failed to edit image.");
    } finally {
      setIsImageEditing(false);
    }
  };

  const handleAnimateImage = async () => {
    if (!uploadedImageUrl) return;
    setIsVideoGenerating(true);
    try {
      const result = await generateVideo(videoPrompt || "Animate this scene dynamically", videoAspectRatio, uploadedImageUrl);
      setVideoUrl(result.url);
      setLastVideoRef(result.videoRef);
      
      // Auto-save video to File System
      onSaveAsset({
        id: Math.random().toString(36).substr(2, 9),
        name: `VeoAnimation-${Date.now()}.mp4`,
        type: 'video',
        url: result.url,
        createdAt: new Date(),
        aspectRatio: videoAspectRatio
      });

    } catch (e) {
      alert("Failed to animate image.");
    } finally {
      setIsVideoGenerating(false);
    }
  };

  const handleVideoAction = async (action: 'extend' | 'edit' | 'trim') => {
    if (!lastVideoRef) return;
    setIsVideoEditing(true);
    try {
      let prompt = videoEditPrompt;
      if (action === 'extend') prompt = `Extend this video by adding 7 seconds of consistent action: ${videoEditPrompt || 'continue the scene'}`;
      if (action === 'trim') prompt = `Refocus this clip and trim it according to: ${videoEditPrompt}`;

      const result = await generateVideo(prompt, videoAspectRatio, undefined, lastVideoRef);
      setVideoUrl(result.url);
      setLastVideoRef(result.videoRef);
      setVideoEditPrompt('');

      onSaveAsset({
        id: Math.random().toString(36).substr(2, 9),
        name: `Veo${action.charAt(0).toUpperCase() + action.slice(1)}-${Date.now()}.mp4`,
        type: 'video',
        url: result.url,
        createdAt: new Date(),
        aspectRatio: videoAspectRatio
      });
    } catch (e) {
      alert(`Failed to ${action} video.`);
    } finally {
      setIsVideoEditing(false);
    }
  };

  const handleSpeech = async () => {
    if (!content) return;
    setIsSpeechGenerating(true);
    try {
      const pcmData = await generateSpeech(content);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const dataInt16 = new Int16Array(pcmData.buffer);
      const frameCount = dataInt16.length;
      const buffer = audioCtx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (e) {
      alert("Failed to generate speech.");
    } finally {
      setIsSpeechGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setUploadedImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    if (!content || !title) return;
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scheduledDateObj = isScheduling ? new Date(`${scheduleDate}T${scheduleTime}`) : undefined;
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      type, title, content,
      platform: selectedPlatforms[0] as any,
      engagement: 0, rating: 0,
      postedAt: new Date(),
      scheduledAt: scheduledDateObj,
      imageUrl: uploadedImageUrl || (type !== 'text' ? `https://picsum.photos/seed/${title}/800/1200` : undefined)
    };
    onPost(newPost);
    setIsPublishing(false);
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const selectFromLibrary = (asset: MediaAsset) => {
    if (asset.type === 'image') {
      setUploadedImageUrl(asset.url);
      setVideoUrl(null);
      setLastVideoRef(null);
    } else {
      setVideoUrl(asset.url);
      setUploadedImageUrl(null);
      // Note: We can't easily recover videoRef from library without persisting the full object
    }
    setShowLibrary(false);
  };

  const renderVisualPreview = () => {
    const previewImage = uploadedImageUrl || `https://picsum.photos/seed/${title || 'default'}/800/1200`;

    if (videoUrl) {
      return (
        <div className={`relative w-full ${videoAspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-[280px]'} mx-auto bg-slate-900 rounded-3xl border-[6px] border-slate-800 overflow-hidden shadow-2xl`}>
          <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold">VEO 3.1</div>
        </div>
      );
    }

    if (type === 'text' || previewPlatform === 'X') {
      return (
        <div className="bg-black border border-slate-800 rounded-2xl p-4 shadow-2xl animate-in zoom-in-95 duration-300 w-full max-w-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-100 text-sm">Alex Creator</span>
                <div className="bg-blue-500 rounded-full p-0.5"><CheckCircle size={10} className="text-white fill-current" /></div>
                <span className="text-slate-500 text-sm">@alex_ai · 1m</span>
              </div>
              <p className="text-slate-200 text-sm mt-1 whitespace-pre-wrap leading-relaxed">{content || "Start typing or generate with AI..."}</p>
              {uploadedImageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-800">
                  <img src={uploadedImageUrl} className="w-full h-auto object-cover max-h-60" alt="Asset" />
                </div>
              )}
              <div className="flex items-center justify-between mt-4 text-slate-500 max-w-xs">
                <MessageCircle size={16} /><Repeat size={16} /><Heart size={16} /><BarChart size={16} /><Share2 size={16} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'reel') {
      return (
        <div className="relative w-full aspect-[9/16] max-w-[280px] mx-auto bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 overflow-hidden shadow-2xl">
          <img src={previewImage} className="w-full h-full object-cover" alt="Video frame" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="flex items-end justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/20" />
                  <span className="text-xs font-bold text-white shadow-sm">alex_ai · Follow</span>
                </div>
                <p className="text-white text-xs line-clamp-3 mb-4 leading-tight">{content || "Caption..."}</p>
              </div>
              <div className="flex flex-col gap-4 items-center mb-2">
                <Heart className="text-white" size={24} /><MessageCircle className="text-white" size={24} /><Share2 className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full max-w-md">
        <div className="aspect-video bg-slate-800 relative">
          <img src={previewImage} className="w-full h-full object-cover" alt="Thumbnail" />
          <div className="absolute bottom-3 right-3 bg-black/80 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">12:45</div>
        </div>
        <div className="p-4 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-100 text-sm line-clamp-2">{title || "Your Vlog Title"}</h4>
            <p className="text-slate-500 text-xs mt-1">Alex AI · 12K views</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-white">Smart Composer</h2>
          <p className="text-slate-400 mt-1">One click to rule them all. Powered by Gemini 3.</p>
        </div>
        {!hasApiKey && (
          <button 
            onClick={handleOpenKey}
            className="flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-500/20 transition-all"
          >
            <Key size={18} /> Enable Advanced AI (Key Required)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex gap-2">
            {(['text', 'reel', 'vlog'] as ContentType[]).map((t) => (
              <button key={t} onClick={() => setType(t)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wide ${type === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {t === 'text' && <FileText size={18} />}{t === 'reel' && <Video size={18} />}{t === 'vlog' && <Play size={18} />}{t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="Post title..." value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xl font-bold placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <button 
                  onClick={() => setShowLibrary(true)}
                  className="aspect-square flex items-center justify-center border border-slate-800 bg-slate-900 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 rounded-2xl transition-all p-3"
                  title="Pick from Library"
                >
                  <FolderOpen size={24} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`h-full aspect-square flex items-center justify-center border border-slate-800 rounded-2xl transition-all ${uploadedImageUrl ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}
                >
                  {uploadedImageUrl ? <img src={uploadedImageUrl} className="w-full h-full object-cover rounded-xl" alt="Preview" /> : <ImageIcon size={24} />}
                </button>
                {uploadedImageUrl && <button onClick={clearImage} className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow-lg border-2 border-slate-900"><CloseIcon size={12} /></button>}
              </div>
            </div>
            
            <div className="relative">
              <textarea placeholder="AI Topic / Image Prompt / Concept..." value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 h-32 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3">
                <div className="flex gap-2">
                  <div className="flex bg-slate-800/80 rounded-xl border border-slate-700 p-0.5">
                    {(['1K', '2K', '4K'] as const).map(s => (
                      <button key={s} onClick={() => setImageSize(s)} className={`text-[10px] px-2 py-1 rounded-lg font-bold transition-all ${imageSize === s ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{s}</button>
                    ))}
                  </div>
                  <button onClick={handleGenerateImage} disabled={!topic || isImageGenerating} className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2 text-xs font-bold">
                    {isImageGenerating ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />} Gen Image (Pro)
                  </button>
                  <button onClick={handleGenerate} disabled={!topic || isGenerating} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-xs font-bold">
                    {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} Magic Caption
                  </button>
                </div>
              </div>
            </div>

            {videoUrl && lastVideoRef && (
              <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 space-y-4 animate-in slide-in-from-left-4 duration-500 shadow-xl shadow-indigo-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl">
                      <Wand size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">AI Video Intelligence</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Veo 3.1 Pro Editor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active State</span>
                  </div>
                </div>

                <div className="relative group">
                  <textarea 
                    value={videoEditPrompt}
                    onChange={(e) => setVideoEditPrompt(e.target.value)}
                    placeholder="Describe edits: 'Add cinematic lighting', 'Add a zoom transition', 'Trim to the best 5 seconds'..." 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all min-h-[80px]"
                  />
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleVideoAction('edit')}
                      disabled={isVideoEditing || !videoEditPrompt}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white p-2 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1.5"
                    >
                      {isVideoEditing ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />} APPLY EDIT
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleVideoAction('extend')}
                    disabled={isVideoEditing}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 p-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold transition-all uppercase tracking-wider"
                  >
                    <FastForward size={14} className="text-indigo-400" /> Extend Video (+7s)
                  </button>
                  <button 
                    onClick={() => handleVideoAction('trim')}
                    disabled={isVideoEditing || !videoEditPrompt}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 p-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-bold transition-all uppercase tracking-wider"
                  >
                    <Scissors size={14} className="text-rose-400" /> AI Smart Trim
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Image Generation Controls</h3>
                <span className="text-[10px] text-indigo-400 font-bold">GEMINI 3 PRO IMAGE</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map(ratio => (
                  <button 
                    key={ratio.id} 
                    onClick={() => setImageAspectRatio(ratio.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                      imageAspectRatio === ratio.id 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {ratio.id} <span className="opacity-50 ml-1">({ratio.label})</span>
                  </button>
                ))}
              </div>
            </div>

            {uploadedImageUrl && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Asset Intelligence</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Edit image: 'Add retro filter', 'Remove background'..." value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                  <button onClick={handleEditImage} disabled={isImageEditing || !editPrompt} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    {isImageEditing ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />} Polish
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-1 flex gap-2">
                    <input type="text" placeholder="Initial animation prompt..." value={videoPrompt} onChange={(e) => setVideoPrompt(e.target.value)} className="flex-1 bg-transparent px-3 text-xs focus:outline-none" />
                    <button onClick={() => setVideoAspectRatio(videoAspectRatio === '16:9' ? '9:16' : '16:9')} className="p-1.5 bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors">
                      {videoAspectRatio === '16:9' ? <Laptop size={14} /> : <Smartphone size={14} />}
                    </button>
                  </div>
                  <button onClick={handleAnimateImage} disabled={isVideoGenerating} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    {isVideoGenerating ? <Loader2 className="animate-spin" size={14} /> : <Film size={14} />} Animate (Veo)
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group focus-within:border-indigo-500/50 transition-colors">
              <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Polish Editor</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <button onClick={handleSpeech} disabled={isSpeechGenerating || !content} className="flex items-center gap-1.5 bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold hover:bg-indigo-600/30 transition-all">
                  {isSpeechGenerating ? <Loader2 className="animate-spin" size={12} /> : <Volume2 size={12} />} TTS Preview
                </button>
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-transparent p-4 h-56 text-slate-300 focus:outline-none resize-none leading-relaxed font-sans placeholder:text-slate-700" placeholder="Edit final content..." />
            </div>

            <div className={`bg-slate-900 border border-slate-800 p-6 rounded-2xl transition-all ${isScheduling ? 'border-indigo-500/50 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isScheduling ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-400'}`}><Calendar size={18} /></div>
                  <div><h3 className="text-sm font-bold text-slate-100">Schedule Distribution</h3><p className="text-xs text-slate-500">Auto-publish cross-platform</p></div>
                </div>
                <button onClick={() => setIsScheduling(!isScheduling)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isScheduling ? 'bg-indigo-600' : 'bg-slate-800'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isScheduling ? 'translate-x-6' : 'translate-x-1'}`} /></button>
              </div>
              {isScheduling && <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Date</label><input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none" /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Time</label><input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none" /></div>
              </div>}
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex flex-col items-center sticky top-24">
            <div className="w-full flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Live Preview</h3>
              <div className="flex bg-slate-800 p-0.5 rounded-lg">
                {(['X', 'Instagram', 'YouTube'] as const).map(p => (
                  <button key={p} onClick={() => setPreviewPlatform(p)} className={`text-[10px] px-3 py-1 rounded-md font-bold transition-all ${previewPlatform === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="w-full flex items-center justify-center min-h-[400px]">
              {renderVisualPreview()}
            </div>

            {(videoUrl || uploadedImageUrl) && (
              <button 
                onClick={() => { setVideoUrl(null); setUploadedImageUrl(null); setLastVideoRef(null); }} 
                className="mt-4 text-[10px] text-slate-500 font-bold uppercase hover:text-rose-500 transition-colors flex items-center gap-1"
              >
                <CloseIcon size={12} /> Clear Current Asset
              </button>
            )}

            <div className="w-full mt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Publish To</h3>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => (
                  <button key={platform.id} onClick={() => togglePlatform(platform.id)} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedPlatforms.includes(platform.id) ? 'bg-slate-800 border-indigo-500/50 text-white' : 'bg-transparent border-slate-800 text-slate-500 grayscale hover:grayscale-0 hover:border-slate-700'}`}>
                    <div className="flex items-center gap-2"><div className={`${platform.color} p-1.5 rounded-lg text-white`}>{platform.icon}</div><span className="font-semibold text-xs">{platform.label}</span></div>
                    {selectedPlatforms.includes(platform.id) && <CheckCircle size={14} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handlePublish} disabled={!content || !title || selectedPlatforms.length === 0 || isPublishing} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/30">
              {isPublishing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {isPublishing ? (isScheduling ? 'Scheduling...' : 'Broadcasting...') : (isScheduling ? 'Confirm Schedule' : 'Blast to All Platforms')}
            </button>
          </div>
        </div>
      </div>

      {/* Library Selection Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600/10 rounded-2xl">
                  <FolderOpen className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Select from Library</h2>
                  <p className="text-xs text-slate-500 font-medium">Pick an existing asset for your post</p>
                </div>
              </div>
              <button onClick={() => setShowLibrary(false)} className="text-slate-500 hover:text-white transition-colors">
                <CloseIcon size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {assets.map((asset) => (
                  <button 
                    key={asset.id} 
                    onClick={() => selectFromLibrary(asset)}
                    className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all text-left"
                  >
                    <div className="aspect-square relative">
                      {asset.type === 'image' ? (
                        <img src={asset.url} className="w-full h-full object-cover" alt={asset.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-700">
                          <Video size={32} className="text-slate-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-slate-300 truncate">{asset.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BarChart = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
);

export default Composer;
