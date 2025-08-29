"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { generateMarketingPost } from "@/ai/flows/marketing-flow";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart as RechartsLineChart,
} from "recharts";

const barChartData = [
  { month: "January", posts: 12, reach: 1860 },
  { month: "February", posts: 18, reach: 2050 },
  { month: "March", posts: 5, reach: 2370 },
  { month: "April", posts: 17, reach: 1730 },
  { month: "May", posts: 20, reach: 2090 },
  { month: "June", posts: 9, reach: 2140 },
];

const barChartConfig = {
  reach: {
    label: "Reach",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const lineChartData = [
  { date: "2024-06-01", clicks: 52 },
  { date: "2024-06-02", clicks: 65 },
  { date: "2024-06-03", clicks: 78 },
  { date: "2024-06-04", clicks: 60 },
  { date: "2024-06-05", clicks: 85 },
  { date: "2024-06-06", clicks: 95 },
  { date: "2024-06-07", clicks: 110 },
];

const lineChartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function MarketingPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<{
    post: string;
    image: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePost = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const result = await generateMarketingPost(prompt);
      setGeneratedContent(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate marketing content.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t.marketing.title}
            </h2>
            <p className="text-muted-foreground">
              Generate AI-powered marketing content for your products.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg border-2 border-primary/10">
            <CardHeader>
              <CardTitle>AI Social Media Post Generator</CardTitle>
              <CardDescription>
                Describe your product or offer, and let AI create a captivating
                post with an image for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="prompt">What do you want to promote?</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A new spicy chicken sandwich made with fresh, locally sourced ingredients."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <Alert variant="destructive" className="no-animation">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleGeneratePost}
                disabled={isLoading || !prompt}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Post
              </Button>
            </CardFooter>
          </Card>

          {isLoading && (
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Generating...</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  AI is crafting your post...
                </p>
              </CardContent>
            </Card>
          )}

          {generatedContent && (
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={generatedContent.image}
                    alt="Generated marketing image"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="prose prose-sm max-w-none rounded-md border bg-muted/50 p-4">
                  <p>{generatedContent.post}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight">
            Campaign Analytics
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Monthly Reach</CardTitle>
                <CardDescription>
                  Total user reach from posts per month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig} className="h-64">
                  <RechartsBarChart accessibilityLayer data={barChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="reach" fill="var(--color-reach)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-2 border-primary/10">
              <CardHeader>
                <CardTitle>Weekly Clicks</CardTitle>
                <CardDescription>
                  Total clicks from all campaigns this week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig} className="h-64">
                  <RechartsLineChart
                    accessibilityLayer
                    data={lineChartData}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Line
                      dataKey="clicks"
                      type="monotone"
                      stroke="var(--color-clicks)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </RechartsLineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
