import React, { useState } from 'react';
import { MediaAsset } from '../../types/cms';
import {
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import { INITIAL_MEDIA_ASSETS } from '../../data/cmsData';

export const MediaLibrary: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_MEDIA_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUploadAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAsset: MediaAsset = {
      id: `med_${Date.now()}`,
      name: file.name,
      type: file.type.includes('image')
        ? 'image'
        : file.type.includes('pdf')
        ? 'pdf'
        : file.type.includes('video')
        ? 'video'
        : 'illustration',
      url: URL.createObjectURL(file),
      sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().slice(0, 10),
      tags: ['جديد', 'مرفق'],
    };

    setAssets([newAsset, ...assets]);
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.tags.some((t) => t.includes(searchQuery));
    const matchesType = selectedType === 'all' || a.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200">
              Médiathèque CMS
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              المكتبة وسجل الوسائط والمرفقات البيداغوجية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مستودع الصور، الملفات المرفقة، الفيديوهات والشروحات الصوتية القابلة لإعادة الاستخدام.
          </p>
        </div>

        <label className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all">
          <Upload className="w-4 h-4" />
          <span>رفع ملف وسائط جديد</span>
          <input type="file" onChange={handleUploadAsset} className="hidden" />
        </label>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900 p-4 rounded-2xl text-white">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="البحث بالاسم أو الوسوم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs p-2.5 rounded-xl focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'pdf', 'image', 'video', 'illustration'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedType === t ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white border border-slate-200 rounded-3xl p-4 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              
              <div className="h-32 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                {asset.type === 'image' || asset.type === 'illustration' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                ) : asset.type === 'pdf' ? (
                  <FileText className="w-12 h-12 text-rose-500" />
                ) : (
                  <Video className="w-12 h-12 text-blue-500" />
                )}
                <span className="absolute top-2 left-2 bg-slate-950/80 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
                  {asset.sizeFormatted}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 truncate" title={asset.name}>{asset.name}</h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">تاريخ الرفع: {asset.uploadedAt}</span>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {asset.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.2 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCopyUrl(asset)}
                className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-amber-600 cursor-pointer"
              >
                {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === asset.id ? 'تم نسخ الرابط' : 'نسخ رابط الرابط'}</span>
              </button>

              <button
                onClick={() => handleDeleteAsset(asset.id)}
                className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
