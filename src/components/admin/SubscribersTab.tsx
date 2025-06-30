
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewsletterSubscribers } from "@/hooks/useNewsletterSubscribers";

const SubscribersTab = () => {
  const { data: subscribers } = useNewsletterSubscribers();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>المشتركون في النشرة البريدية</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscribers?.map((subscriber) => (
            <div key={subscriber.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">{subscriber.name}</p>
                <p className="text-sm text-muted-foreground">{subscriber.email}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(subscriber.created_at)}
              </div>
            </div>
          ))}
          {(!subscribers || subscribers.length === 0) && (
            <p className="text-center text-muted-foreground py-8">
              لا يوجد مشتركون حتى الآن
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscribersTab;
