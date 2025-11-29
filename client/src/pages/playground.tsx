import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createWorker } from 'tesseract.js';
import { 
  Scan, 
  Eye, 
  EyeOff, 
  FileText, 
  Loader2, 
  Check, 
  X 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Playground() {
  // OCR State
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [scannedText, setScannedText] = useState<string>("");
  const [foundDate, setFoundDate] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);

  // ZK State
  const [zkInputDate, setZkInputDate] = useState("");
  const [zkStatus, setZkStatus] = useState<'idle' | 'proving' | 'verified'>('idle');
  const [zkResult, setZkResult] = useState<boolean | null>(null);

  // OCR Handler
  const handleOCR = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setOcrStatus('scanning');
    setScannedText("");
    setFoundDate(null);
    setOcrProgress(0);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const ret = await worker.recognize(e.target.files[0]);
      const text = ret.data.text;
      setScannedText(text);
      await worker.terminate();

      // Date Extraction Logic (Same as store)
      const datePatterns = [
        /\b(19|20)\d{2}[-\/](0[1-9]|1[0-2])[-\/](0[1-9]|[12]\d|3[01])\b/, 
        /\b(0[1-9]|[12]\d|3[01])[-\/.](0[1-9]|1[0-2])[-\/.](19|20)\d{2}\b/, 
        /\b(0[1-9]|[12]\d|3[01])\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s(19|20)\d{2}\b/i 
      ];

      let date = null;
      for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
          date = match[0];
          break;
        }
      }
      setFoundDate(date || "No date found");
      setOcrStatus('success');

    } catch (err) {
      setOcrStatus('failed');
    }
  };

  // ZK Logic Handler
  const runZKLogic = () => {
    if (!zkInputDate) return;
    setZkStatus('proving');
    
    setTimeout(() => {
      const birth = new Date(zkInputDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      setZkResult(age >= 18);
      setZkStatus('verified');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold">Feature Playground</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the core technologies of the Midnight Age Verification System without connecting a wallet.
          Test the OCR engine and Zero-Knowledge logic independently.
        </p>
      </div>

      <Tabs defaultValue="ocr" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-8">
          <TabsTrigger value="ocr">Document Scanner</TabsTrigger>
          <TabsTrigger value="zk">ZK Logic Demo</TabsTrigger>
        </TabsList>

        {/* OCR TAB */}
        <TabsContent value="ocr">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-panel border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5 text-primary" /> Upload Document
                </CardTitle>
                <CardDescription>
                  Upload an image with text (ID card, paper) to test the Tesseract.js engine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-12 hover:border-primary/50 transition-colors cursor-pointer relative bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center text-center">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleOCR}
                    accept="image/*"
                  />
                  <FileText className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">Click or Drag Image</p>
                  <p className="text-xs text-muted-foreground mt-1">Processed locally in browser</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-0 bg-black/40">
              <CardHeader>
                <CardTitle>Extraction Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ocrStatus === 'idle' && (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm italic">
                    Waiting for upload...
                  </div>
                )}
                
                {ocrStatus === 'scanning' && (
                  <div className="h-[200px] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <div className="text-center">
                      <div className="text-sm font-medium">Scanning Text...</div>
                      <div className="text-xs text-muted-foreground mt-1">{ocrProgress}% Complete</div>
                    </div>
                  </div>
                )}

                {ocrStatus === 'success' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Detected Date</div>
                      <div className="text-xl font-mono font-bold text-primary">
                        {foundDate}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Raw Text Dump</div>
                      <div className="p-3 rounded-lg bg-black/50 border border-white/5 h-[150px] overflow-y-auto text-xs font-mono text-gray-400">
                        {scannedText}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ZK TAB */}
        <TabsContent value="zk">
          <Card className="glass-panel border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-accent" /> Zero-Knowledge Logic
              </CardTitle>
              <CardDescription>
                Simulate how Midnight proves age without revealing the date.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-8 relative">
                {/* Input Side */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-center text-muted-foreground">Private Input (Witness)</div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs">Date of Birth</label>
                      <Input 
                        type="date" 
                        value={zkInputDate} 
                        onChange={(e) => setZkInputDate(e.target.value)}
                        className="bg-black/20"
                      />
                    </div>
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-200 flex items-center gap-2">
                      <EyeOff className="w-3 h-3" />
                      This data stays private
                    </div>
                  </div>
                </div>

                {/* Circuit Logic Visualization */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <Button 
                    size="icon" 
                    className="rounded-full w-12 h-12 bg-accent text-black hover:bg-accent/90 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                    onClick={runZKLogic}
                    disabled={!zkInputDate || zkStatus === 'proving'}
                  >
                    {zkStatus === 'proving' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-6 h-6" />}
                  </Button>
                </div>

                {/* Output Side */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-center text-muted-foreground">Public Output</div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full flex flex-col items-center justify-center min-h-[160px]">
                    {zkStatus === 'idle' && (
                      <div className="text-sm text-muted-foreground">Ready to prove</div>
                    )}
                    {zkStatus === 'proving' && (
                      <div className="text-sm text-accent animate-pulse">Calculating Proof...</div>
                    )}
                    {zkStatus === 'verified' && (
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                      >
                        <div className={`text-2xl font-bold mb-2 ${zkResult ? 'text-green-400' : 'text-red-400'}`}>
                          {zkResult ? 'IS ADULT' : 'NOT ADULT'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Zero knowledge of actual date
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center text-xs text-muted-foreground bg-white/5 p-3 rounded-lg">
                Note: In the real Midnight protocol, this logic happens inside a cryptographic circuit (zk-SNARK).
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
