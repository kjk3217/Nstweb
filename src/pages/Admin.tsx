import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Loader2, Save, UploadCloud, LayoutTemplate, Eye, 
  CheckCircle2, AlertCircle, Home, Palette, BarChart3,
  Mail, Image as ImageIcon, X, Monitor, Menu, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- [초기 데이터 타입 및 기본값 정의] ---
// SiteContext를 사용하지 않고 직접 데이터를 호출하여 안정성을 높입니다.
const defaultData = {
  hero: {
    title: "", titleColor: "#ffffff", titleSize: "60",
    subtitle: "", subtitleColor: "#e2e8f0", subtitleSize: "20",
    bgImage: ""
  },
  whyNST: {
    sectionTitle: "", titleColor: "#05668D", desc: "", cardHeight: "400",
    card1: { title: "", desc: "", image: "" },
    card2: { title: "", desc: "", image: "" },
    card3: { title: "", desc: "", image: "" }
  },
  results: {
    bgColor: "#05668D",
    stat1: { value: "", label: "", sub: "" },
    stat2: { value: "", label: "", sub: "" },
    stat3: { value: "", label: "", sub: "" }
  },
  contact: { phone: "", email: "", address: "" },
  theme: { primaryColor: "#05668D", secondaryColor: "#00A896" }
};

// --- [Toast Component] ---
const Toast = ({ message, type, onClose }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: 50 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 border ${
      type === 'success' 
        ? 'bg-white border-[#00A896] text-[#00A896]' 
        : 'bg-white border-red-500 text-red-500'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
    <span className="font-bold text-sm">{message}</span>
    <button onClick={onClose} className="ml-4 hover:opacity-70">
      <X size={16} className="text-slate-400" />
    </button>
  </motion.div>
);

export const AdminPage = () => {
  // --- [State] ---
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero'); // 현재 선택된 탭
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- [Effects] ---
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "site_config", "main"), (docSnap) => {
      if (docSnap.exists()) {
        setData({ ...defaultData, ...docSnap.data() });
      } else {
        setDoc(docSnap.ref, defaultData);
        setData(defaultData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // --- [Handlers] ---
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveField = async (fieldPath: string, value: string) => {
    setSaving(true);
    try {
      const docRef = doc(db, "site_config", "main");
      // 중첩 객체 업데이트를 위한 dot notation 처리
      await updateDoc(docRef, { [fieldPath]: value });
      showToast('설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error(error);
      showToast('저장에 실패했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('파일 크기는 5MB 이하여야 합니다', 'error');
      return;
    }
    
    setUploading(true);
    try {
      const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      await saveField(fieldPath, url);
      showToast('이미지가 업로드되었습니다.', 'success');
    } catch (error) {
      showToast('이미지 업로드 실패', 'error');
    } finally {
      setUploading(false);
    }
  };

  // --- [Helper Components] ---
  const InputGroup = ({ label, path, type = "text", placeholder = "", description = "" }: any) => {
    // path를 이용해 현재 data에서 값을 안전하게 추출
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((o, i) => (o ? o[i] : ""), obj);
    };
    
    const currentValue = data ? getValue(data, path) : "";

    return (
      <div className="space-y-2 group">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-slate-700 group-hover:text-[#05668D] transition-colors">
            {label}
          </Label>
          {description && <span className="text-xs text-slate-400">{description}</span>}
        </div>
        <div className="flex gap-2">
          {type === "textarea" ? (
            <Textarea 
              defaultValue={currentValue}
              key={currentValue} // 키 변경으로 리렌더링 유도하여 값 갱신 보장
              className="min-h-[80px] bg-white border-slate-200 focus:border-[#00A896] focus:ring-[#00A896]/20 resize-none transition-all"
              onBlur={(e) => saveField(path, e.target.value)}
            />
          ) : (
            <Input 
              type={type}
              defaultValue={currentValue}
              key={currentValue}
              placeholder={placeholder}
              className="bg-white border-slate-200 focus:border-[#00A896] focus:ring-[#00A896]/20 transition-all"
              onBlur={(e) => saveField(path, e.target.value)}
            />
          )}
        </div>
      </div>
    );
  };

  const ImageUploadCard = ({ title, currentImage, fieldPath }: any) => (
    <div className="space-y-3">
      <Label className="text-sm font-bold text-slate-700">{title}</Label>
      <div className="group relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#00A896] hover:bg-[#00A896]/5 transition-all cursor-pointer">
        {currentImage ? (
          <img src={currentImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-xs">이미지 없음</span>
          </div>
        )}
        
        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
          <UploadCloud size={32} className="mb-2" />
          <span className="font-bold text-sm">이미지 변경</span>
          <span className="text-[10px] opacity-80 mt-1">Click to upload</span>
          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, fieldPath)} />
        </label>

        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-white" size={32} />
          </div>
        )}
      </div>
    </div>
  );

  // --- [Navigation Items] ---
  const menuItems = [
    { id: 'hero', label: '메인 히어로', icon: Monitor, desc: '첫 화면 이미지 및 문구' },
    { id: 'whynst', label: 'Why NST', icon: CheckCircle2, desc: '특장점 섹션 관리' },
    { id: 'results', label: '실적 및 통계', icon: BarChart3, desc: '숫자로 보는 성과' },
    { id: 'contact', label: '연락처 & 테마', icon: Palette, desc: '기본 정보 및 색상' },
  ];

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#00A896] w-10 h-10" />
          <p className="text-slate-500 font-medium">관리자 설정 로딩중...</p>
        </div>
      </div>
    );
  }

  // --- [Render Logic] ---
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Toast Container */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* === Sidebar (Desktop) === */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-slate-200 h-full shadow-sm z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#05668D] to-[#00A896] rounded-xl flex items-center justify-center shadow-lg shadow-[#05668D]/20">
            <LayoutTemplate className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 tracking-tight">KNST Admin</h1>
            <p className="text-xs text-slate-400 font-medium">Dashboard v1.0</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 px-4 mb-2 uppercase tracking-wider">Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-[#05668D] text-white shadow-md shadow-[#05668D]/20' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#05668D]'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-[#05668D]'} />
              <div className="flex flex-col items-start">
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 text-slate-600 hover:text-[#00A896] hover:bg-[#00A896]/5 border-slate-200"
            onClick={() => window.open('/', '_blank')}
          >
            <Eye size={16} />
            사이트 미리보기
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => window.location.href='/'}
          >
            <LogOut size={16} />
            나가기
          </Button>
        </div>
      </aside>

      {/* === Main Content Area === */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#05668D] rounded-lg flex items-center justify-center">
                <LayoutTemplate className="text-white" size={16} />
             </div>
             <span className="font-bold text-slate-800">KNST Admin</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
               <div className="p-6 border-b border-slate-100 bg-slate-50">
                 <h2 className="font-bold text-lg text-slate-800">메뉴 선택</h2>
               </div>
               <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.id ? 'bg-[#05668D] text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
               </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto pb-20">
            
            {/* Header for the active section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                {menuItems.find(m => m.id === activeTab)?.icon && React.createElement(menuItems.find(m => m.id === activeTab)!.icon, { size: 32, className: "text-[#00A896]" })}
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <p className="text-slate-500">{menuItems.find(m => m.id === activeTab)?.desc}</p>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* --- [1] Hero Section Settings --- */}
              {activeTab === 'hero' && (
                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader className="bg-white border-b border-slate-100 pb-4">
                      <CardTitle className="text-lg">텍스트 콘텐츠 설정</CardTitle>
                      <CardDescription>메인 화면의 문구를 수정합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                       <InputGroup label="메인 타이틀" path="hero.title" type="textarea" description="가장 크게 보이는 제목입니다." />
                       <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="글자 크기(px)" path="hero.titleSize" type="number" />
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700">글자 색상</Label>
                            <div className="flex gap-2">
                              <Input type="color" defaultValue={data.hero.titleColor} className="w-12 h-10 p-1 cursor-pointer" onBlur={(e) => saveField('hero.titleColor', e.target.value)} />
                              <Input defaultValue={data.hero.titleColor} className="flex-1" disabled />
                            </div>
                          </div>
                       </div>
                       <div className="h-px bg-slate-100 my-2" />
                       <InputGroup label="서브 타이틀" path="hero.subtitle" type="textarea" description="제목 아래의 보조 설명입니다." />
                       <div className="grid grid-cols-2 gap-4">
                          <InputGroup label="글자 크기(px)" path="hero.subtitleSize" type="number" />
                          <div className="space-y-2">
                            <Label className="text-sm font-bold text-slate-700">글자 색상</Label>
                            <div className="flex gap-2">
                              <Input type="color" defaultValue={data.hero.subtitleColor} className="w-12 h-10 p-1 cursor-pointer" onBlur={(e) => saveField('hero.subtitleColor', e.target.value)} />
                              <Input defaultValue={data.hero.subtitleColor} className="flex-1" disabled />
                            </div>
                          </div>
                       </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">배경 이미지</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <ImageUploadCard 
                          title="Hero Background"
                          currentImage={data.hero.bgImage}
                          fieldPath="hero.bgImage"
                        />
                      </CardContent>
                    </Card>
                    
                    <div className="bg-[#E6FFFA] p-4 rounded-xl border border-[#00A896]/20 text-[#006d62] text-sm">
                      <div className="font-bold mb-1 flex items-center gap-1"><CheckCircle2 size={14}/> Tip</div>
                      배경 이미지는 어두운 톤이나 오버레이가 적용된 이미지를 사용하는 것이 텍스트 가독성에 좋습니다.
                    </div>
                  </div>
                </div>
              )}

              {/* --- [2] Why NST Settings --- */}
              {activeTab === 'whynst' && (
                <div className="space-y-8">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle>섹션 공통 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 grid md:grid-cols-2 gap-6">
                      <InputGroup label="섹션 제목" path="whyNST.sectionTitle" />
                      <InputGroup label="설명 문구" path="whyNST.desc" type="textarea" />
                      <div className="space-y-2">
                         <Label className="text-sm font-bold text-slate-700">제목 색상</Label>
                         <div className="flex gap-2">
                           <Input type="color" defaultValue={data.whyNST.titleColor} className="w-12 h-10 p-1 cursor-pointer" onBlur={(e) => saveField('whyNST.titleColor', e.target.value)} />
                           <Input defaultValue={data.whyNST.titleColor} className="flex-1" disabled />
                         </div>
                      </div>
                      <InputGroup label="카드 높이(px)" path="whyNST.cardHeight" type="number" />
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-3 gap-6">
                    {['card1', 'card2', 'card3'].map((card, idx) => (
                      <Card key={card} className="shadow-md border-slate-200 hover:border-[#00A896] transition-colors">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">카드 {idx + 1}</CardTitle>
                            <span className="bg-white text-xs px-2 py-1 rounded border border-slate-200 font-mono text-slate-500">#{idx+1}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <ImageUploadCard 
                            title="카드 배경 이미지"
                            currentImage={data.whyNST[card].image}
                            fieldPath={`whyNST.${card}.image`}
                          />
                          <div className="h-px bg-slate-100 my-2" />
                          <InputGroup label="카드 제목" path={`whyNST.${card}.title`} />
                          <InputGroup label="카드 내용" path={`whyNST.${card}.desc`} type="textarea" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* --- [3] Results Settings --- */}
              {activeTab === 'results' && (
                <div className="space-y-8">
                  <Card className="shadow-sm border-slate-200 bg-white">
                     <CardHeader>
                       <CardTitle>배경 스타일</CardTitle>
                     </CardHeader>
                     <CardContent className="p-6">
                        <div className="max-w-xs space-y-2">
                           <Label className="text-sm font-bold text-slate-700">배경 색상</Label>
                           <div className="flex gap-2">
                             <Input type="color" defaultValue={data.results.bgColor} className="w-12 h-10 p-1 cursor-pointer" onBlur={(e) => saveField('results.bgColor', e.target.value)} />
                             <Input defaultValue={data.results.bgColor} className="flex-1" disabled />
                           </div>
                           <p className="text-xs text-slate-400">섹션 전체의 배경색을 결정합니다.</p>
                        </div>
                     </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-3 gap-6">
                     {['stat1', 'stat2', 'stat3'].map((stat, idx) => (
                       <Card key={stat} className="shadow-sm border-slate-200 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#05668D] to-[#00A896]" />
                          <CardHeader>
                             <CardTitle className="text-center text-lg">통계 지표 {idx + 1}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 p-6">
                             <InputGroup label="강조 숫자" path={`results.${stat}.value`} placeholder="예: 1,000+" />
                             <InputGroup label="라벨(영문)" path={`results.${stat}.label`} placeholder="PROJECTS" />
                             <InputGroup label="설명(한글)" path={`results.${stat}.sub`} placeholder="누적 프로젝트" />
                          </CardContent>
                       </Card>
                     ))}
                  </div>
                </div>
              )}

              {/* --- [4] Contact & Theme Settings --- */}
              {activeTab === 'contact' && (
                <div className="grid lg:grid-cols-2 gap-8">
                   <Card className="shadow-sm border-slate-200 h-fit">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-[#00A896]/10 rounded-lg text-[#00A896]"><Mail size={18} /></div>
                           <CardTitle>연락처 정보</CardTitle>
                         </div>
                         <CardDescription>하단 푸터 및 연락처 섹션에 표시될 정보입니다.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-5">
                         <InputGroup label="대표 전화번호" path="contact.phone" />
                         <InputGroup label="이메일 주소" path="contact.email" />
                         <InputGroup label="주소" path="contact.address" type="textarea" />
                      </CardContent>
                   </Card>

                   <Card className="shadow-sm border-slate-200 h-fit">
                      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-[#05668D]/10 rounded-lg text-[#05668D]"><Palette size={18} /></div>
                           <CardTitle>테마 컬러 설정</CardTitle>
                         </div>
                         <CardDescription>웹사이트 전체의 브랜드 컬러를 설정합니다.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-8">
                         <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Primary Color (메인)</Label>
                            <div className="flex gap-3 items-center">
                               <div className="w-16 h-16 rounded-xl shadow-inner border border-slate-200" style={{ backgroundColor: data.theme.primaryColor }} />
                               <div className="flex-1 space-y-2">
                                 <div className="flex gap-2">
                                   <Input type="color" defaultValue={data.theme.primaryColor} className="w-10 h-10 p-1 cursor-pointer" onBlur={(e) => saveField('theme.primaryColor', e.target.value)} />
                                   <Input defaultValue={data.theme.primaryColor} className="font-mono uppercase" disabled />
                                 </div>
                                 <p className="text-xs text-slate-400">헤더, 주요 버튼, 강조 텍스트 등에 사용됩니다.</p>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Secondary Color (보조)</Label>
                            <div className="flex gap-3 items-center">
                               <div className="w-16 h-16 rounded-xl shadow-inner border border-slate-200" style={{ backgroundColor: data.theme.secondaryColor }} />
                               <div className="flex-1 space-y-2">
                                 <div className="flex gap-2">
                                   <Input type="color" defaultValue={data.theme.secondaryColor} className="w-10 h-10 p-1 cursor-pointer" onBlur={(e) => saveField('theme.secondaryColor', e.target.value)} />
                                   <Input defaultValue={data.theme.secondaryColor} className="font-mono uppercase" disabled />
                                 </div>
                                 <p className="text-xs text-slate-400">포인트 요소, 아이콘, 그라데이션 등에 사용됩니다.</p>
                               </div>
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};
