import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../page.module.css";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const res = await fetch("https://admin.altiedge.com/api/blogs");
  const payload = await res.json();
  const blogs = payload?.data ?? payload;

  return (Array.isArray(blogs) ? blogs : []).map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function SingleBlog({ params }) {
  const { slug } = params;
  const res = await fetch("https://admin.altiedge.com/api/blogs");
  const payload = await res.json();
  const data = payload?.data ?? payload;
  const blog = (Array.isArray(data) ? data : []).find((item) => item.slug === slug);

  if (!blog) return <div>Blog not found.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{blog.title}</h1>

      <Image
        src={`https://admin.altiedge.com/storage/${blog.banner_image}`}
        alt={blog.title}
        width={800}
        height={400}
        className={styles.heroImage}
      />

      <div className={styles.meta}>
        <p>Location: {blog.location}</p>
        <p>Published: {new Date(blog.created_at).toLocaleDateString()}</p>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: blog.description }}
      />

      <Link href="/blogs" className={styles.backLink}>
        ← Back to Blogs
      </Link>
    </div>
  );
}
