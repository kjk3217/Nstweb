import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useContent } from '../context/ContentContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Save, LayoutDashboard } from 'lucide-react';

const sections = [
  { id: 'hero', name: 'Hero Section (메인)' },
  { id: 'why', name: 'Why NST (특장점)' },
  { id: 'results', name: 'Results (성과)' },
  // 필요한 만큼 섹션을 여기에 정의합니다.
];

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState('hero');
  const { content, updateContent } = useContent();
  
  // 로컬 편집 상태 관리
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (content && content[activeSection]) {
      setEditData(content[activeSection]);
    } else {
      setEditData({});
    }
  }, [content, activeSection]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("로그인 실패: 이메일과 비밀번호를 확인하세요.");
    }
  };

  const handleSave = () => {
    updateContent(activeSection, editData);
  };

  const handleChange = (key: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [key]: value }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">KNST Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-[#05668D]">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-[#05668D] text-white flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-2 font-bold text-xl">
          <LayoutDashboard /> KNST Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === sec.id ? 'bg-white text-[#05668D] font-bold' : 'hover:bg-white/10'
              }`}
            >
              {sec.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button onClick={() => signOut(auth)} variant="destructive" className="w-full flex items-center gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              {sections.find(s => s.id === activeSection)?.name} 수정
            </h1>
            <Button onClick={handleSave} className="bg-[#00A896] hover:bg-[#008c7d] flex items-center gap-2">
              <Save size={18} /> 변경사항 저장
            </Button>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              {Object.keys(editData).map((key) => (
                <div key={key} className="space-y-2">
                  <Label className="capitalize text-slate-600">{key}</Label>
                  {key.toLowerCase().includes('desc') || key.includes('subtitle') ? (
                    <Textarea 
                      value={editData[key]} 
                      onChange={(e) => handleChange(key, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <Input 
                      value={editData[key]} 
                      onChange={(e) => handleChange(key, e.target.value)} 
                    />
                  )}
                  {/* 이미지 미리보기 */}
                  {(key.includes('Image') || key.includes('img')) && (
                     <div className="mt-2">
                       <p className="text-xs text-slate-400 mb-1">Preview:</p>
                       <img src={editData[key]} alt="preview" className="w-40 h-auto rounded-md border" />
                     </div>
                  )}
                </div>
              ))}
              {Object.keys(editData).length === 0 && (
                <div className="text-center text-slate-400 py-12">
                  편집할 데이터가 정의되지 않았습니다. <br/>ContentContext.tsx의 defaultContent를 확인하세요.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
