import { checkIsAdmin, ADMIN_EMAIL } from '@/lib/admin';
import { getAdminUiPosts } from '@/actions/admin';
import { redirect } from 'next/navigation';
import { ShieldAlert, ShieldCheck, Clock, FileImage, LayoutList } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DeletePostButton } from './DeletePostButton';
import Link from 'next/link';
import type { UiPost } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    redirect('/');
  }

  const posts = await getAdminUiPosts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight">God Mode Console</h1>
            <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground flex items-center gap-2 font-mono text-sm">
            <ShieldAlert className="h-4 w-4" /> Authenticated as {ADMIN_EMAIL}
          </p>
        </div>
        
        <div className="flex gap-4">
           <Card className="px-6 py-3 bg-secondary/50 border-border inline-flex flex-col items-center shadow-lg">
             <span className="text-3xl font-black text-primary">{posts.length}</span>
             <span className="text-xs tracking-widest uppercase font-semibold text-muted-foreground">Total Arena Posts</span>
           </Card>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex gap-2 items-center">
           <LayoutList className="h-5 w-5 text-muted-foreground" />
           <h2 className="font-bold text-lg">Arena Database Registry</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center text-muted-foreground">
             <FileImage className="h-12 w-12 opacity-50 mb-4" />
             <p className="font-medium text-lg">Database is utterly barren.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left align-middle">
              <thead className="bg-muted/40 text-xs uppercase font-semibold text-muted-foreground tracking-wider border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Image Preview</th>
                  <th scope="col" className="px-6 py-4">Title / ID</th>
                  <th scope="col" className="px-6 py-4">Description</th>
                  <th scope="col" className="px-6 py-4 text-center">Timestamp</th>
                  <th scope="col" className="px-6 py-4 text-right rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-card">
                {posts.map((post: UiPost) => (
                  <tr key={post.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 relative rounded-lg border border-border shadow-sm overflow-hidden bg-muted flex items-center justify-center group">
                        {/* Use object URL rendering efficiently */}
                        <img 
                          src={post.imageUrl} 
                          alt="preview" 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="font-bold text-base truncate pr-6">{post.title}</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-1 truncate pr-6 text-primary/70">{post.id}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.description || <span className="italic opacity-50">No description provided</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <div className="flex justify-end gap-2">
                         <Link href={`/arena`} className="text-xs bg-secondary hover:bg-secondary/70 text-secondary-foreground font-semibold px-3 py-2 rounded-lg transition-colors">
                           View Live
                         </Link>
                         <DeletePostButton postId={post.id} title={post.title} />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
