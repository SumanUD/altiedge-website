"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


function stripHtml(html) {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || "";
  return text.length > 200 ? text.slice(0, 200) + "..." : text;
}


export const ContentBlog = () => {
  const [blogs, setBlogs] = useState([]);

useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await fetch("https://admin.altiedge.com/api/blogs");
      const payload = await res.json();
      const data = payload?.data ?? payload;
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  fetchBlogs();
}, []);


  return (
    <div className="blog-contents">
      <div className="header-content">
        <div className="title">Blogs</div>
      </div>

      {/* <div className="blog-switch">
        <div className="switch-button">
          <div className="btn-primary active">All Blogs</div>
          <div className="btn-primary">Latest</div>
        </div>
      </div> */}

      {blogs.map((item) => (
        <div key={item.id}>
          <Link href={`/blogs/${item.slug}`}>
            <div className="blog-card">
              <div className="image">
                <Image
                  src={`https://admin.altiedge.com/storage/${item.banner_image}`}
                // src="https://imgs.search.brave.com/jmFZSEFS0E0rBfPlz84rL8fkUj1LUjNglSjGXIq19XA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taXIt/czMtY2RuLWNmLmJl/aGFuY2UubmV0L3By/b2plY3RzLzQwNC9h/ZmUxNjQxNTMyOTg3/MjkuWTNKdmNDd3lO/amM1TERJd09UWXNN/VFU1TERBLmpwZw"
                  alt={item.title}
                  width={400}
                  height={250}
                />
              </div>
              <div className="text-contents">
                <div className="text-left">
                  <div className="blog-tags">
                    {item.tags &&
                      item.tags.split(",").map((cate, i) => (
                        <div className="tag" key={i}>
                          {cate.trim()}
                        </div>
                      ))}
                  </div>
                  <div className="blog-title">{item.title}</div>
                 <div className="blog-description">
  {stripHtml(item.description)}
</div>

                </div>
                <div className="text-right">
                  <div className="blog-meta">
                    <span className="author">{item.location}</span> |{" "}
                    <span className="date">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <div className="underline"></div>
        </div>
      ))}

      {/* <div className="btn-primary-dark">More Blogs</div> */}
    </div>
  );
};

