import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import "./Mainsection.css"
const initialChapters = [
  { 
    id: 1, 
    name: "Rational Numbers", 
    progress: 100,
    subChapters: [
      { name: "Basics", progress: 100, isComplete: true },
      { name: "Operations", progress: 100, isComplete: true },
      { name: "Applications", progress: 100, isComplete: true }
    ] 
  },
  { 
    id: 2, 
    name: "Number Systems", 
    progress: 40,
    current: true,
    subChapters: [
      { name: "Binary", progress: 100, isComplete: true },
      { name: "Decimal", progress: 20, isComplete: false },
      { name: "Hexadecimal", progress: 0, isComplete: false }
    ] 
  },
  { 
    id: 3, 
    name: "Algebraic Functions", 
    progress: 0,
    subChapters: [
      { name: "Linear", progress: 0, isComplete: false },
      { name: "Quadratic", progress: 0, isComplete: false },
      { name: "Polynomial", progress: 0, isComplete: false }
    ] 
  }
];

const initialContent = {
  videos: [
    { id: 1, title: "Introduction to Numbers", thumbnail: "/api/placeholder/160/90", progress: 75, isComplete: false },
    { id: 2, title: "Basic Operations", thumbnail: "/api/placeholder/160/90", progress: 60, isComplete: false },
    { id: 3, title: "Advanced Concepts", thumbnail: "/api/placeholder/160/90", progress: 40, isComplete: false },
    { id: 4, title: "Problem Solving", thumbnail: "/api/placeholder/160/90", progress: 20, isComplete: false },
    { id: 5, title: "Practice Examples", thumbnail: "/api/placeholder/160/90", progress: 0, isComplete: false }
  ],
  flipbooks: [
    { id: 1, title: "Flipbook 1", thumbnail: "/api/placeholder/120/160", progress: 75, isComplete: false },
    { id: 2, title: "Flipbook 2", thumbnail: "/api/placeholder/120/160", progress: 45, isComplete: false }
  ],
  eContent: [
    { id: 1, title: "E-Content 1", thumbnail: "/api/placeholder/120/160", progress: 90, isComplete: false },
    { id: 2, title: "E-Content 2", thumbnail: "/api/placeholder/120/160", progress: 30, isComplete: false }
  ]
};

const MainSection = () => {
  const [chapters, setChapters] = useState(initialChapters);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [activeChapter, setActiveChapter] = useState<string>("");
  const [content, setContent] = useState(initialContent);

  const handleChapterClick = (id: number, name: string) => {
    setSelectedChapter((prev) => (prev === id ? null : id));
    setActiveChapter(name);
  };

  const handleSubChapterClick = (chapterId: number, subChapterIndex: number) => {
    setChapters(prev => {
      const newChapters = [...prev];
      const chapter = newChapters.find(c => c.id === chapterId);
      if (chapter) {
        // Update progress
        if (!chapter.subChapters[subChapterIndex].isComplete) {
          chapter.subChapters[subChapterIndex].progress = 100;
          chapter.subChapters[subChapterIndex].isComplete = true;
          
          // Calculate overall chapter progress
          const completedSubChapters = chapter.subChapters.filter(sub => sub.isComplete).length;
          chapter.progress = (completedSubChapters / chapter.subChapters.length) * 100;
        }
      }
      return newChapters;
    });
  };

  const handleContentClick = (type: 'videos' | 'flipbooks' | 'eContent', id: number) => {
    setContent(prev => {
      const newContent = { ...prev };
      const item = newContent[type].find(item => item.id === id);
      if (item && !item.isComplete) {
        item.progress = 100;
        item.isComplete = true;
      }
      return newContent;
    });
  };

  return (
    <div className="main-section">
      {/* Left Part */}
      <div className="left-section">
        <div className="section-header">
          <h2>Chapters / Topics</h2>
        </div>
        <ul className="chapter-list">
          {chapters.map((chapter) => (
            <li key={chapter.id} className="chapter-item">
              <div className="chapter-container">
                <button 
                  onClick={() => handleChapterClick(chapter.id, chapter.name)}
                  className={`chapter-button ${chapter.current ? 'current' : ''}`}
                >
                  <div className="chapter-progress-container">
                    <div 
                      className="chapter-progress-bar"
                      style={{ height: `${chapter.progress}%` }}
                    />
                    {chapter.progress === 100 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : chapter.current ? (
                      <Circle className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <span className="chapter-number">{chapter.id}.</span>
                  <span className="chapter-name">{chapter.name}</span>
                </button>
                
                {selectedChapter === chapter.id && (
                  <ul className="sub-chapter-list">
                    {chapter.subChapters.map((subChapter, index) => (
                      <li 
                        key={index} 
                        className="sub-chapter-item"
                        onClick={() => handleSubChapterClick(chapter.id, index)}
                      >
                        <div className="sub-chapter-progress-container">
                          <div 
                            className="sub-chapter-progress-bar"
                            style={{ height: `${subChapter.progress}%` }}
                          />
                          {subChapter.isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <span>{subChapter.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Center Part */}
      <div className="center-section">
        <div className="section-header">
          <h2>{activeChapter || "Select a Chapter"}</h2>
        </div>
        {activeChapter ? (
          <video controls className="main-video">
            <source
              src={`https://example.com/${activeChapter.toLowerCase().replace(/\s+/g, "-")}.mp4`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="select-prompt">Please select a chapter from the left to view the video.</p>
        )}
      </div>

      {/* Right Part */}
      <div className="right-section">
        <div className="section-header">
          <h2>Additional Content</h2>
        </div>
        
        <div className="content-section">
          <h3>Videos</h3>
          <div className="video-list">
            {content.videos.map((video) => (
              <div 
                key={video.id} 
                className="video-item"
                onClick={() => handleContentClick('videos', video.id)}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="content-progress-container">
                    <div 
                      className="content-progress-bar"
                      style={{ height: `${video.progress}%` }}
                    />
                    {video.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h3>Flipbooks</h3>
          <div className="resource-list">
            {content.flipbooks.map((flipbook) => (
              <div 
                key={flipbook.id} 
                className="resource-item"
                onClick={() => handleContentClick('flipbooks', flipbook.id)}
              >
                <div className="resource-thumbnail">
                  <img src={flipbook.thumbnail} alt={flipbook.title} />
                  <div className="content-progress-container">
                    <div 
                      className="content-progress-bar"
                      style={{ height: `${flipbook.progress}%` }}
                    />
                    {flipbook.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>
                <p>{flipbook.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h3>E-Content</h3>
          <div className="resource-list">
            {content.eContent.map((item) => (
              <div 
                key={item.id} 
                className="resource-item"
                onClick={() => handleContentClick('eContent', item.id)}
              >
                <div className="resource-thumbnail">
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="content-progress-container">
                    <div 
                      className="content-progress-bar"
                      style={{ height: `${item.progress}%` }}
                    />
                    {item.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;









