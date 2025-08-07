
"use client";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function MarketingPage() {
  const { t } = useLanguage();
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t.marketing.title}</h2>
            <p className="text-muted-foreground">
              {t.marketing.description}
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t.marketing.comingSoon}</CardTitle>
            <CardDescription>
              {t.marketing.comingSoonDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t.marketing.workingHard}</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
