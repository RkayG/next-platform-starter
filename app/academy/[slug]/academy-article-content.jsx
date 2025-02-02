"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import { formatTimestamp } from '@/utils';
import BottomSubscribe from '@/components/bottom-subscribe';
import { FaCopy, FaFacebookF, FaTwitter, FaBookReader, FaUser, FaShare, FaReddit, FaLinkedin } from 'react-icons/fa';
import SEO from '@/components/SEO';
import { Metadata, ResolvingMetadata } from 'next';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const Navigation = ({ title }) => {
  return (
    <nav className="flex items-center space-x-2 text-pink-900 ml-6 mt-6">
      <p>
        <Link href="/academy" className="hover:text-blue-600">
          Academy <span className='mr-1'>&gt;</span>
        </Link>
        <p className="font-semibold text-blue-800 inline">{title}</p>
      </p>
    </nav>
  );
};

const AcademyArticleContent = (initialData) => {
  const [academyArticleData, setAcademyArticleData] = useState(initialData.initialData);
  const [metadataCache, setMetadataCache] = useState(null);
  const [additionalArticles, setAdditionalArticles] = useState([]);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState([]);
  const slug = academyArticleData.slug;



  // Fetch additional articles
  useEffect(() => {
    const fetchAdditionalArticles = async (track) => {
      try {
        const response = await axios.get(`${apiUrl}/academy`);
        const allArticles = response.data;
        
        const filteredArticles = allArticles.filter(article => 
          article.slug !== slug && article.track === track
        );
        setAdditionalArticles(filteredArticles.slice(0, 6));
      } catch (error) {
        console.error('Failed to load additional articles:', error);
      }
    };

    if (academyArticleData?.track) {
      fetchAdditionalArticles(academyArticleData.track);
    }
  }, [slug, academyArticleData]);



  //======= Extract Headings for table of contents ===================================
  useEffect(() => {
    if (academyArticleData?.content) {
      const extractedHeadings = [];

      const traverseRichText = (node) => {
        if (node.nodeType === 'heading-1' || node.nodeType === 'heading-2') {
          const text = node.content
            .map((item) => (item.value ? item.value : ''))
            .join('');
          const id = text.replace(/\s+/g, '-').toLowerCase();
          const level = node.nodeType === 'heading-1' ? 1 : 2;
          extractedHeadings.push({ id, text, level });
        }

        if (node.content) {
          node.content.forEach(traverseRichText);
        }
      };

      traverseRichText(academyArticleData.content);
      setHeadings(extractedHeadings);
    }
  }, [academyArticleData]);

 //===================== Extract headings end ===============

 // error fetching articles
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // loading state 
  if (!academyArticleData) {
    return (
      <div className="loading-dots m-auto my-44">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    );
  }

  // extract article data
  const { postHeading, imageLink, timestamp, content, track, author, tags, authorSocials, keywords, excerpt } = academyArticleData;
  console.log(postHeading)
  // get window url
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  // copy link functionality =========
  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch((error) => {
      console.error('Failed to copy the link:', error);
    });
  };
//==========================================

// share article functionality ========================
  const handleShareToFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(facebookShareUrl, '_blank');
  };

  const handleShareToTwitter = () => {
    const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(postHeading)}`;
    window.open(twitterShareUrl, '_blank');
  };
//========================================================

//format article content page ===========================
  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { file, title } = node.data.target.fields;
        return (
          <div className="my-8">
            <img src={file.url} alt={title} className="w-full rounded-lg shadow-md" />
            {title && <p className="text-center text-sm text-gray-600 mt-2">{title}</p>}
          </div>
        );
      },
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="mb-2 leading-relaxed">
          {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
        </p>
      ),
      [BLOCKS.HEADING_1]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
          <h1 id={id} className="text-3xl font-bold my-6">
            {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
          </h1>
        );
      },
      [BLOCKS.HEADING_2]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
          <h2 id={id} className="text-2xl font-bold mb-4 mt-6">
            {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
          </h2>
        );
      },
      // Heading 3 Node
      [BLOCKS.HEADING_3]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
            <h3 id={id} className="text-xl font-bold mb-2 mt-4">
                {children.map((child, index) => (
                    typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>
                ))}
            </h3>
        );
      },
      // Heading 4 Node
      [BLOCKS.HEADING_4]: (node, children) => {
        const text = children.reduce((acc, child) => acc + (typeof child === 'string' ? child : ''), '');
        const id = text.replace(/\s+/g, '-').toLowerCase();
        return (
            <h4 id={id} className="text-lg font-bold mb-2">
                {children.map((child, index) => (
                    typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>
                ))}
            </h4>
        );
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} className="text-blue-600 font-bold hover:underline transition-colors duration-300">
          {children.map((child, index) => (typeof child === 'string' ? child : <React.Fragment key={index}>{child}</React.Fragment>))}
        </a>
      ),
      // Unordered List Node
      [BLOCKS.UL_LIST]: (node, children) => (
        <ul className="list-disc list-outside pl-5 mb-1 text-gray-700">{children}</ul>
      ),
      
      // Ordered List Node
      [BLOCKS.OL_LIST]: (node, children) => (
        <ol className="list-decimal list-outside pl-4 mb-4 text-gray-700">{children}</ol>
      ),
      
      // List Item Node
      [BLOCKS.LIST_ITEM]: (node, children) => (
        <li className="mb-2 pl-1">{children}</li>
      ),
    },
  };
  //=============================== format end ===========================================

  return (
    <>
      <Navigation title={postHeading} />

      <div className='max-w-[785px] m-auto'>
        <div className="p-4 mt-12">
          <h1 className="text-3xl font-bold text-center my-6 max-w-[785px]">{postHeading}</h1>
          <span className='flex flex-wrap justify-between mb-6 mx-4'>
            <p className='text-gray-500 font-semibold'>{formatTimestamp(timestamp)}</p>
            <div className='flex flex-wrap gap-4 text-lg text-gray-500'>
              <FaCopy onClick={handleCopyLink} className="cursor-pointer" />
              <FaFacebookF onClick={handleShareToFacebook} className="cursor-pointer" />
              <FaTwitter onClick={handleShareToTwitter} className="cursor-pointer" />
            </div>
          </span>
          {imageLink && <img src={imageLink} alt='Article thumbnail' className="w-[785px] rounded-lg" />}
          {/* author details */}
          <div className='flex'>
          <p className="flex items-center mt-8 font-semibold text-gray-500">
                <FaUser className="mr-2" />
                 <span className='font-light italic'>by </span>{author}
            </p>
            {authorSocials && authorSocials.map((link, index) => {
              let icon;
              if (link.includes("twitter.com") || link.includes("x.com")) icon = <FaTwitter title={link} />;
              else if (link.includes("linkedin.com")) icon = <FaLinkedin title={link} />;
              else if (link.includes("facebook.com")) icon = <FaFacebookF title={link} />;
              else if (link.includes("reddit.com")) icon = <FaReddit title={link} />;
              return (
                <a key={index} href={link} className="ml-3 mt-9 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  {icon}
                </a>
              );                   
            })}
          </div>
          
          {content ? (
            <div>
              <div className="my-6">
                <h2 className="text-xl font-bold">Contents</h2>
                <ul className="list-disc ml-6 text-orange-900">
                  {headings.map((heading, index) => (
                    <li key={index} className=' pb-1 my-2'>
                      <a href={`#${heading.id}`} className="hover:text-blue-700 font-semibold">{heading.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12">{documentToReactComponents(content, renderOptions)}</div>
              <div className='mt-8'>
                {tags.map((tag, index) => (
                  <div key={index} className='inline-flex px-4 py-2 m-2 border-2 border-blue-600 rounded-full
                  text-blue-600'>{tag}</div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-500">Content is not available.</p>}
        </div>
        
      </div>

       {/* =========== Display additional articles ============================================= */}
       <div className="py-8 px-3 mt-12 border rounded-md bg-gray-50 mb-32">
        <h2 className="text-2xl font-bold mb-6 px-6">More Articles in {track} </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalArticles.map((article) => (
             <Link href={`/academy/${article.slug}`} key={article._id}>
             <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
               <div className="relative h-48">
                 <img src={article.imageLink} alt={article.postHeading} className="h-full w-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                 <div className="absolute bottom-0 left-0 right-0 p-4">
                   <h3 className="text-xl font-bold text-white">{article.postHeading}</h3>
                 </div>
               </div>
               <div className="p-6">
                 <p className='text-sm text-gray-500 mb-2'>{formatTimestamp(article.timestamp)}</p>
                 <p className="text-gray-600 mb-4">{article.description}</p>
                 <div className='flex justify-between items-center'>
                   <span className='flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-lg'>
                     <FaBookReader className='mr-2'/>
                     {article.track}
                   </span>
                    <FaShare className='text-orange-600 hover:text-orange-700 cursor-pointer'/> 
                 </div>
               </div>
             </div>
           </Link>
          ))}
        </div>
      </div> 
     {/* ========================= additional articles end =================================*/}
      
      <BottomSubscribe />

    </>
  );
};

export default AcademyArticleContent;
