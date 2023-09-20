import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const Trollbox = () => {
  return (
    <Card className="flex flex-col max-h-[calc(100vh-280px)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="mb-2 text-sm font-medium text-muted-foreground">
          Trollbox
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mt-6 font-mono text-xs">coming soon :)</p>
      </CardContent>
    </Card>
  );
};
