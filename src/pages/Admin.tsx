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

export const AdminPage = () => {
  const { data } = useSiteData();
  const [uploading, setUploading] = useState(false);

  const saveText = async (field: string, value: string) => {
    const docRef = doc(db, "site_config", "main");
    await updateDoc(docRef, { [field]: value });
    alert("저장되었습니다!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      await saveText(fieldName, url);
    } catch (error) {
      alert("이미지 업로드 실패: " + error);
    } finally {
      setUploading(false);
    }
  };

  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">사이트 관리자</h1>
        <Button variant="outline" onClick={() => window.location.href='/'}>홈으로 이동</Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hero">메인 화면 설정</TabsTrigger>
          <TabsTrigger value="theme">테마 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>메인 배너 (Hero Section)</CardTitle>
              <CardDescription>메인 타이틀과 배경 이미지를 수정할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>메인 타이틀</Label>
                <div className="flex gap-2">
                  <Textarea id="hero-title" defaultValue={data.hero?.title} className="text-lg font-bold" />
                  <Button onClick={() => saveText("hero.title", (document.getElementById('hero-title') as HTMLInputElement).value)}>저장</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>서브 설명글</Label>
                <div className="flex gap-2">
                  <Input id="hero-subtitle" defaultValue={data.hero?.subtitle} />
                  <Button onClick={() => saveText("hero.subtitle", (document.getElementById('hero-subtitle') as HTMLInputElement).value)}>저장</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>배경 이미지</Label>
                <div className="border p-4 rounded-md bg-slate-50">
                  {data.hero?.bgImage && <img src={data.hero.bgImage} alt="Current" className="w-40 h-24 object-cover rounded mb-4 shadow-sm" />}
                  <Input type="file" onChange={(e) => handleImageUpload(e, "hero.bgImage")} disabled={uploading} />
                  {uploading && <p className="text-sm text-blue-500 mt-2">이미지 업로드 중...</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
           <Card>
             <CardHeader>
               <CardTitle>디자인 테마</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center gap-4">
                  <Label>포인트 컬러</Label>
                  <input 
                    type="color" 
                    defaultValue={data.theme?.primaryColor}
                    className="h-10 w-20 cursor-pointer rounded border"
                    onChange={(e) => saveText("theme.primaryColor", e.target.value)}
                  />
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
