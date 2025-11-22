import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { useSiteData } from '@/SiteContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Loader2, Save, UploadCloud, LayoutTemplate, Eye, 
  CheckCircle2, AlertCircle, Home, Palette, BarChart3,
  Mail, Image as ImageIcon, X, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Toast 알림 컴포넌트
const Toast = ({ message, type, onClose }: any) => (
  <motion.div
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
      type === 'success' ? 'bg-[#00A896] text-white' : 'bg-red-500 text-white'
    }`}
  >
    {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-4 hover:opacity-70">
      <X size={18} />
    </button>
  </motion.div>
);

export const AdminPage = () => {
  const { data } = useSiteData();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Toast 표시 함수
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 저장 함수
  const saveField = async (fieldPath: string, value: string) => {
    setSaving(true);
    try {
      const docRef = doc(db, "site_config", "main");
      await updateDoc(docRef, { [fieldPath]: value });
      showToast('저장 완료!', 'success');
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      showToast('저장 실패', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 크기 체크 (5MB)
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
      showToast('이미지 업로드 완료!', 'success');
    } catch (error) {
      showToast('업로드 실패', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#05668D] to-[#00A896]">
        <div className="text-center">
          <Loader2 className="animate-spin text-white w-12 h-12 mx-auto mb-4" />
          <p className="text-white text-lg">데이터 로딩중...</p>
        </div>
      </div>
    );
  }

  // 입력 그룹 컴포넌트 (개선된 버전)
  const InputGroup = ({ label, path, type = "text", placeholder = "", description = "" }: any) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-700">{label}</Label>
        {description && <span className="text-xs text-slate-400">{description}</span>}
      </div>
      <div className="flex gap-2">
        {type === "textarea" ? (
          <Textarea 
            defaultValue={path.split('.').reduce((o:any, i:any) => o[i], data)} 
            id={path} 
            className="min-h-[100px] border-slate-200 focus:border-[#00A896] focus:ring-[#00A896]"
            onChange={() => setHasChanges(true)}
          />
        ) : (
          <Input 
            type={type}
            defaultValue={path.split('.').reduce((o:any, i:any) => o[i], data)} 
            id={path}
            placeholder={placeholder}
            className="border-slate-200 focus:border-[#00A896] focus:ring-[#00A896]"
            onChange={() => setHasChanges(true)}
          />
        )}
        <Button 
          size="icon"
          className="bg-[#00A896] hover:bg-[#008c7d] text-white shrink-0"
          onClick={() => saveField(path, (document.getElementById(path) as HTMLInputElement).value)}
          disabled={saving}
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        </Button>
      </div>
    </div>
  );

  // 이미지 업로드 카드
  const ImageUploadCard = ({ title, currentImage, fieldPath }: any) => (
    <Card className="overflow-hidden border-2 border-slate-100 hover:border-[#00A896] transition-all">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-base flex items-center gap-2">
          <ImageIcon size={18} className="text-[#00A896]" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden mb-3 relative group shadow-md">
          <img src={currentImage} className="w-full h-full object-cover" alt={title} />
          <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
            <UploadCloud className="text-white mb-2" size={32} />
            <span className="text-white font-semibold">클릭하여 변경</span>
            <span className="text-white/70 text-xs mt-1">최대 5MB</span>
            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, fieldPath)} />
          </label>
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Toast 알림 */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm backdrop-blur-sm bg-white/90">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#05668D] to-[#00A896] rounded-xl flex items-center justify-center">
              <LayoutTemplate className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800">KNST 관리자</h1>
              <p className="text-xs text-slate-500">사이트 콘텐츠 관리</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => window.open('/', '_blank')} 
              variant="outline"
              className="border-[#00A896] text-[#00A896] hover:bg-[#00A896] hover:text-white"
            >
              <Eye size={16} className="mr-2" />
              미리보기
            </Button>
            <Button 
              onClick={() => window.location.href='/'} 
              className="bg-gradient-to-r from-[#05668D] to-[#00A896] text-white"
            >
              <Home size={16} className="mr-2" />
              사이트로
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <Tabs defaultValue="hero" className="space-y-8">
          {/* 탭 리스트 */}
          <div className="bg-white rounded-2xl shadow-md p-2 border border-slate-100">
            <TabsList className="grid grid-cols-4 w-full bg-transparent gap-2">
              <TabsTrigger 
                value="hero" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#05668D] data-[state=active]:to-[#00A896] data-[state=active]:text-white rounded-xl transition-all"
              >
                <Monitor size={18} className="mr-2" />
                메인 히어로
              </TabsTrigger>
              <TabsTrigger 
                value="whynst"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#05668D] data-[state=active]:to-[#00A896] data-[state=active]:text-white rounded-xl transition-all"
              >
                <CheckCircle2 size={18} className="mr-2" />
                Why NST
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#05668D] data-[state=active]:to-[#00A896] data-[state=active]:text-white rounded-xl transition-all"
              >
                <BarChart3 size={18} className="mr-2" />
                실적/통계
              </TabsTrigger>
              <TabsTrigger 
                value="contact"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#05668D] data-[state=active]:to-[#00A896] data-[state=active]:text-white rounded-xl transition-all"
              >
                <Mail size={18} className="mr-2" />
                연락처/테마
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 1. Hero Section */}
          <TabsContent value="hero" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                  <CardTitle className="text-2xl">🎯 메인 히어로 섹션</CardTitle>
                  <CardDescription>웹사이트 첫 화면의 메인 타이틀과 배경을 설정합니다</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* 텍스트 설정 */}
                    <div className="space-y-6">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-lg mb-4 text-slate-700">📝 텍스트 설정</h3>
                        <div className="space-y-4">
                          <InputGroup 
                            label="메인 타이틀" 
                            path="hero.title" 
                            type="textarea"
                            description="메인 헤드라인"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="글자 크기(px)" path="hero.titleSize" type="number" />
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">글자 색상</Label>
                              <div className="flex gap-2">
                                <Input 
                                  type="color" 
                                  defaultValue={data.hero.titleColor}
                                  id="hero.titleColor"
                                  className="h-10 w-20"
                                  onChange={() => setHasChanges(true)}
                                />
                                <Input 
                                  type="text"
                                  defaultValue={data.hero.titleColor}
                                  className="flex-1"
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-lg mb-4 text-slate-700">📄 서브 타이틀</h3>
                        <div className="space-y-4">
                          <InputGroup 
                            label="서브 타이틀" 
                            path="hero.subtitle" 
                            type="textarea"
                            description="부가 설명"
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="글자 크기(px)" path="hero.subtitleSize" type="number" />
                            <div className="space-y-2">
                              <Label className="text-sm font-semibold text-slate-700">글자 색상</Label>
                              <div className="flex gap-2">
                                <Input 
                                  type="color" 
                                  defaultValue={data.hero.subtitleColor}
                                  id="hero.subtitleColor"
                                  className="h-10 w-20"
                                />
                                <Input 
                                  type="text"
                                  defaultValue={data.hero.subtitleColor}
                                  className="flex-1"
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 이미지 업로드 */}
                    <div>
                      <ImageUploadCard 
                        title="배경 이미지"
                        currentImage={data.hero.bgImage}
                        fieldPath="hero.bgImage"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* 2. Why NST Section */}
          <TabsContent value="whynst" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-2 border-slate-100 shadow-lg mb-6">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                  <CardTitle className="text-2xl">✨ Why NST 섹션</CardTitle>
                  <CardDescription>NST 공법의 강점을 소개하는 섹션을 설정합니다</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <InputGroup label="섹션 제목" path="whyNST.sectionTitle" />
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">제목 색상</Label>
                      <div className="flex gap-2">
                        <Input type="color" defaultValue={data.whyNST.titleColor} id="whyNST.titleColor" className="h-10 w-20" />
                        <Input type="text" defaultValue={data.whyNST.titleColor} className="flex-1" disabled />
                      </div>
                    </div>
                    <InputGroup label="설명 문구" path="whyNST.desc" type="textarea" />
                    <InputGroup label="카드 높이(px)" path="whyNST.cardHeight" type="number" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {['card1', 'card2', 'card3'].map((cardKey, idx) => (
                  <Card key={cardKey} className="border-2 border-slate-100 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#05668D]/10 to-[#00A896]/10 border-b">
                      <CardTitle className="text-lg">카드 {idx + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden relative group shadow-md">
                        <img src={data.whyNST[cardKey].image} className="w-full h-full object-cover" alt="card" />
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                          <UploadCloud className="text-white mb-2" size={24} />
                          <span className="text-white text-sm font-semibold">이미지 변경</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, `whyNST.${cardKey}.image`)} />
                        </label>
                      </div>
                      <InputGroup label="제목" path={`whyNST.${cardKey}.title`} />
                      <InputGroup label="내용" path={`whyNST.${cardKey}.desc`} type="textarea" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* 3. Results Section */}
          <TabsContent value="results" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                  <CardTitle className="text-2xl">📊 실적 및 통계</CardTitle>
                  <CardDescription>회사의 주요 성과 지표를 설정합니다</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-slate-700">배경 색상</Label>
                      <div className="flex gap-2">
                        <Input type="color" defaultValue={data.results.bgColor} id="results.bgColor" className="h-10 w-20" />
                        <Input type="text" defaultValue={data.results.bgColor} className="flex-1" disabled />
                        <Button 
                          size="icon"
                          className="bg-[#00A896] hover:bg-[#008c7d]"
                          onClick={() => saveField('results.bgColor', (document.getElementById('results.bgColor') as HTMLInputElement).value)}
                        >
                          <Save size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {['stat1', 'stat2', 'stat3'].map((statKey, idx) => (
                      <div key={statKey} className="p-6 border-2 border-slate-200 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#05668D] to-[#00A896] rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold text-lg">{idx + 1}</span>
                          </div>
                          <h4 className="font-bold text-slate-700">통계 {idx + 1}</h4>
                        </div>
                        <div className="space-y-4">
                          <InputGroup label="값 (예: 1,018+)" path={`results.${statKey}.value`} />
                          <InputGroup label="라벨" path={`results.${statKey}.label`} />
                          <InputGroup label="설명" path={`results.${statKey}.sub`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* 4. Contact & Theme */}
          <TabsContent value="contact" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                  <CardTitle className="text-xl">📞 연락처 정보</CardTitle>
                  <CardDescription>고객이 문의할 수 있는 연락처를 설정합니다</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <InputGroup label="전화번호" path="contact.phone" placeholder="043-222-2322" />
                  <InputGroup label="이메일" path="contact.email" placeholder="info@knst.co.kr" />
                  <InputGroup label="주소" path="contact.address" type="textarea" />
                </CardContent>
              </Card>
              
              <Card className="border-2 border-slate-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b">
                  <CardTitle className="text-xl">🎨 전체 테마 색상</CardTitle>
                  <CardDescription>사이트 전체의 색상 테마를 설정합니다</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">메인 포인트 컬러</Label>
                    <div className="flex gap-2">
                      <Input type="color" defaultValue={data.theme.primaryColor} id="theme.primaryColor" className="h-12 w-24" />
                      <Input type="text" defaultValue={data.theme.primaryColor} className="flex-1" disabled />
                      <Button 
                        size="icon"
                        className="bg-[#00A896] hover:bg-[#008c7d]"
                        onClick={() => saveField('theme.primaryColor', (document.getElementById('theme.primaryColor') as HTMLInputElement).value)}
                      >
                        <Save size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">보조 컬러</Label>
                    <div className="flex gap-2">
                      <Input type="color" defaultValue={data.theme.secondaryColor} id="theme.secondaryColor" className="h-12 w-24" />
                      <Input type="text" defaultValue={data.theme.secondaryColor} className="flex-1" disabled />
                      <Button 
                        size="icon"
                        className="bg-[#00A896] hover:bg-[#008c7d]"
                        onClick={() => saveField('theme.secondaryColor', (document.getElementById('theme.secondaryColor') as HTMLInputElement).value)}
                      >
                        <Save size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm text-slate-600 mb-3 font-medium">미리보기</p>
                    <div className="flex gap-3">
                      <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: data.theme.primaryColor }} />
                      <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: data.theme.secondaryColor }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
