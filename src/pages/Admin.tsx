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
import { Loader2, Save, UploadCloud, LayoutTemplate, Type, Palette, Image as ImageIcon } from 'lucide-react';

export const AdminPage = () => {
  const { data } = useSiteData();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 통합 저장 함수 (점 표기법으로 중첩된 데이터 업데이트)
  // 예: saveField("hero.title", "새 제목")
  const saveField = async (fieldPath: string, value: string) => {
    setSaving(true);
    try {
      const docRef = doc(db, "site_config", "main");
      await updateDoc(docRef, { [fieldPath]: value });
      alert("저장되었습니다!");
    } catch (error) {
      console.error(error);
      alert("저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      await saveField(fieldPath, url);
    } catch (error) {
      alert("업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  if (!data) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // 입력 그룹 컴포넌트 (반복되는 UI 줄이기 위함)
  const InputGroup = ({ label, path, type = "text", placeholder = "" }: any) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {type === "textarea" ? (
          <Textarea 
            defaultValue={path.split('.').reduce((o:any, i:any) => o[i], data)} 
            id={path} 
            className="min-h-[80px]"
          />
        ) : (
          <Input 
            type={type}
            defaultValue={path.split('.').reduce((o:any, i:any) => o[i], data)} 
            id={path}
            placeholder={placeholder}
          />
        )}
        <Button 
          size="icon"
          variant="outline"
          onClick={() => saveField(path, (document.getElementById(path) as HTMLInputElement).value)}
        >
          <Save size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <LayoutTemplate className="text-blue-600" /> 관리자 모드
        </h1>
        <Button onClick={() => window.location.href='/'} variant="secondary">사이트로 이동</Button>
      </header>

      <div className="container mx-auto max-w-5xl py-8 px-4">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="hero">메인(Hero)</TabsTrigger>
            <TabsTrigger value="whynst">Why NST</TabsTrigger>
            <TabsTrigger value="results">실적/통계</TabsTrigger>
            <TabsTrigger value="contact">연락처/테마</TabsTrigger>
          </TabsList>

          {/* --- 1. Hero Section --- */}
          <TabsContent value="hero">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>텍스트 및 스타일</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <InputGroup label="메인 타이틀" path="hero.title" type="textarea" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="글자 크기(px)" path="hero.titleSize" type="number" />
                    <InputGroup label="글자 색상" path="hero.titleColor" type="color" />
                  </div>
                  <div className="h-px bg-slate-100 my-4" />
                  <InputGroup label="서브 타이틀" path="hero.subtitle" type="textarea" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="글자 크기(px)" path="hero.subtitleSize" type="number" />
                    <InputGroup label="글자 색상" path="hero.subtitleColor" type="color" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader><CardTitle>배경 이미지</CardTitle></CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden mb-4 relative group">
                    <img src={data.hero.bgImage} className="w-full h-full object-cover" alt="bg" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold">
                      <UploadCloud className="mr-2" /> 클릭하여 변경
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "hero.bgImage")} />
                    </label>
                  </div>
                  {uploading && <p className="text-blue-500 text-sm text-center">업로드 중...</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- 2. Why NST Section --- */}
          <TabsContent value="whynst">
            <Card className="mb-6">
              <CardHeader><CardTitle>섹션 설정</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <InputGroup label="섹션 제목" path="whyNST.sectionTitle" />
                <InputGroup label="제목 색상" path="whyNST.titleColor" type="color" />
                <InputGroup label="설명 문구" path="whyNST.desc" type="textarea" />
                <InputGroup label="카드 높이(px)" path="whyNST.cardHeight" type="number" />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              {['card1', 'card2', 'card3'].map((cardKey, idx) => (
                <Card key={cardKey}>
                  <CardHeader className="pb-2"><CardTitle className="text-base">카드 {idx + 1}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-slate-100 rounded overflow-hidden relative group">
                      <img src={data.whyNST[cardKey].image} className="w-full h-full object-cover" alt="card" />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-white text-xs">
                        이미지 변경
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, `whyNST.${cardKey}.image`)} />
                      </label>
                    </div>
                    <InputGroup label="제목" path={`whyNST.${cardKey}.title`} />
                    <InputGroup label="내용" path={`whyNST.${cardKey}.desc`} type="textarea" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* --- 3. Results Section --- */}
          <TabsContent value="results">
            <Card>
              <CardHeader><CardTitle>배경 및 통계 수치</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <InputGroup label="배경 색상" path="results.bgColor" type="color" />
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4 border p-4 rounded-lg">
                    <h4 className="font-bold text-center">통계 1</h4>
                    <InputGroup label="값 (예: 1,018+)" path="results.stat1.value" />
                    <InputGroup label="라벨 (Complexes)" path="results.stat1.label" />
                    <InputGroup label="설명" path="results.stat1.sub" />
                  </div>
                  <div className="space-y-4 border p-4 rounded-lg">
                    <h4 className="font-bold text-center">통계 2</h4>
                    <InputGroup label="값" path="results.stat2.value" />
                    <InputGroup label="라벨" path="results.stat2.label" />
                    <InputGroup label="설명" path="results.stat2.sub" />
                  </div>
                  <div className="space-y-4 border p-4 rounded-lg">
                    <h4 className="font-bold text-center">통계 3</h4>
                    <InputGroup label="값" path="results.stat3.value" />
                    <InputGroup label="라벨" path="results.stat3.label" />
                    <InputGroup label="설명" path="results.stat3.sub" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- 4. Contact & Theme --- */}
          <TabsContent value="contact">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>연락처 정보</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup label="전화번호" path="contact.phone" />
                  <InputGroup label="이메일" path="contact.email" />
                  <InputGroup label="주소" path="contact.address" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>전체 테마 색상</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <InputGroup label="메인 포인트 컬러" path="theme.primaryColor" type="color" />
                  <InputGroup label="보조 컬러" path="theme.secondaryColor" type="color" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};
