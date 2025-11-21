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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Palette, 
  Save, 
  Image as ImageIcon, 
  ChevronLeft, 
  UploadCloud, 
  Type,
  Loader2
} from 'lucide-react';

export const AdminPage = () => {
  const { data } = useSiteData();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 텍스트 저장 함수
  const saveText = async (field: string, value: string) => {
    setSaving(true);
    try {
      const docRef = doc(db, "site_config", "main");
      await updateDoc(docRef, { [field]: value });
      // 간단한 저장 완료 알림 (실제로는 Toast 등을 쓰면 더 좋습니다)
      alert("성공적으로 저장되었습니다!"); 
    } catch (error) {
      console.error(error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 이미지 업로드 함수
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 파일명을 고유하게 만들기 위해 타임스탬프 추가
      const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      
      await saveText(fieldName, url);
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400 mx-auto" />
          <p className="text-slate-500 font-medium">설정을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 상단 헤더 */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">관리자 대시보드</h1>
              <p className="text-xs text-slate-500 mt-1">웹사이트 콘텐츠 관리 시스템</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.href='/'}
            className="text-slate-600 hover:text-slate-900 gap-2"
          >
            <ChevronLeft size={16} />
            홈페이지로 돌아가기
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="hero" className="space-y-8">
          
          {/* 탭 메뉴 */}
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12 p-1 bg-slate-200/50 rounded-full">
              <TabsTrigger 
                value="hero" 
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                메인 배너 관리
              </TabsTrigger>
              <TabsTrigger 
                value="theme" 
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                <Palette className="w-4 h-4 mr-2" />
                디자인 테마
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 1. 메인 배너 설정 탭 */}
          <TabsContent value="hero" className="animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 왼쪽: 텍스트 편집 */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-md border-slate-100 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b pb-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Type size={18} />
                      <CardTitle className="text-lg">메인 텍스트 수정</CardTitle>
                    </div>
                    <CardDescription>웹사이트 접속 시 가장 먼저 보이는 문구를 수정합니다.</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-600">메인 타이틀 (강조 문구)</Label>
                      <div className="relative">
                        <Textarea 
                          id="hero-title" 
                          defaultValue={data.hero?.title} 
                          className="min-h-[100px] text-lg font-medium resize-none pr-12 leading-relaxed"
                          placeholder="메인 타이틀을 입력하세요..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => saveText("hero.title", (document.getElementById('hero-title') as HTMLInputElement).value)}
                          disabled={saving}
                          className="bg-slate-900 hover:bg-slate-800"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          타이틀 저장
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-600">서브 타이틀 (설명)</Label>
                      <div className="relative">
                        <Textarea 
                          id="hero-subtitle" 
                          defaultValue={data.hero?.subtitle} 
                          className="min-h-[80px] resize-none pr-12 text-slate-600"
                          placeholder="서브 타이틀을 입력하세요..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          variant="outline"
                          onClick={() => saveText("hero.subtitle", (document.getElementById('hero-subtitle') as HTMLInputElement).value)}
                          disabled={saving}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          설명 저장
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 오른쪽: 이미지 관리 */}
              <div className="lg:col-span-1">
                <Card className="shadow-md border-slate-100 h-full">
                  <CardHeader className="bg-slate-50/50 border-b pb-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ImageIcon size={18} />
                      <CardTitle className="text-lg">배경 이미지</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="aspect-video w-full rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-400 transition-colors cursor-pointer">
                        
                        {/* 현재 이미지 미리보기 */}
                        {data.hero?.bgImage ? (
                          <img 
                            src={data.hero.bgImage} 
                            alt="Current Background" 
                            className="w-full h-full object-cover transition-opacity group-hover:opacity-40" 
                          />
                        ) : (
                          <div className="text-slate-400 flex flex-col items-center">
                            <ImageIcon size={40} className="mb-2 opacity-50" />
                            <span className="text-sm">이미지 없음</span>
                          </div>
                        )}

                        {/* 업로드 오버레이 */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg mb-2">
                            <UploadCloud className="w-6 h-6 text-slate-900" />
                          </div>
                          <span className="text-sm font-bold text-slate-900 bg-white/80 px-3 py-1 rounded-full">이미지 변경하기</span>
                        </div>

                        {/* 실제 파일 입력 (투명하게 덮어씌움) */}
                        <input 
                          type="file" 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "hero.bgImage")}
                          disabled={uploading}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>상태</span>
                          <span className={uploading ? "text-blue-500 font-bold" : "text-green-600"}>
                            {uploading ? "업로드 중..." : "최신 상태"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          * 권장 사이즈: 1920 x 1080px<br/>
                          * 용량이 너무 큰 이미지는 로딩이 느려질 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 2. 테마 설정 탭 */}
          <TabsContent value="theme" className="animate-in fade-in-50 duration-500">
            <Card className="shadow-md border-slate-100 max-w-2xl mx-auto">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette size={24} />
                </div>
                <CardTitle className="text-xl">브랜드 컬러 설정</CardTitle>
                <CardDescription>웹사이트의 주요 포인트 색상을 변경합니다.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative group cursor-pointer">
                    {/* 컬러 피커 디자인 커스텀 */}
                    <div 
                      className="w-32 h-32 rounded-full shadow-xl border-4 border-white ring-1 ring-slate-200 flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ backgroundColor: data.theme?.primaryColor || '#000000' }}
                    >
                      <Palette className="text-white/80 w-10 h-10 drop-shadow-md" />
                    </div>
                    <input 
                      type="color" 
                      defaultValue={data.theme?.primaryColor}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => saveText("theme.primaryColor", e.target.value)}
                    />
                    <div className="absolute bottom-0 right-0 bg-white border border-slate-200 rounded-full p-2 shadow-md">
                      <UploadCloud size={14} className="text-slate-500" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-slate-900">현재 선택된 색상</p>
                    <p className="font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-md text-sm">
                      {data.theme?.primaryColor}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 text-yellow-800 text-sm p-4 rounded-lg w-full flex gap-3 items-start">
                    <div className="mt-0.5">💡</div>
                    <p>색상을 변경하면 버튼, 강조 텍스트, 아이콘 등 웹사이트 전반의 포인트 컬러가 즉시 변경됩니다.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};
