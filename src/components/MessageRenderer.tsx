
import React from 'react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import DialogueBubble from './DialogueBubble';
import { createMultilingualText } from '@/types/language';
import { DialogueRole } from '@/data/medicalCases';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Brain } from 'lucide-react';

interface MessageType {
  role: DialogueRole;
  content?: string;
  reasoning_content?: string;
  id?: string;
  isStreaming?: boolean;
  rawText?: string;
  file?: {
    url: string;
    name: string;
  };
  images?: string[];
}

interface MessageRendererProps {
  message: MessageType;
  language: Language;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ message, language }) => {
  if (message.role === 'patient') {
    // User message
    return (
      <div className="mb-4 flex flex-col items-end">
        <div className="max-w-[85%] w-fit min-w-[20%]">
          <DialogueBubble
            role={message.role}
            text={createMultilingualText(message.content, message.content)}
            isActive={true}
            language={language}
            isStreaming={message.isStreaming}
          />
          
          {/* File display area */}
          {message.file && (
            <div className="mt-2">
              <div className="relative group">
                {['.nii', '.nii.gz'].some(ext => message.file?.name.endsWith(ext)) ? (
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-medical-blue/30">
                    <div className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-medical-blue"/>
                      <span className="text-sm font-medium text-medical-blue">
                        {getText(translations.medicalVolumeData, language)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      {message.file.name}
                    </p>
                  </div>
                ) : (
                  <img
                    src={message.file.url}
                    alt={message.file.name}
                    className="rounded-lg border-2 border-medical-blue/20 object-contain bg-white shadow-sm transition-all hover:border-medical-blue/30 hover:shadow-md"
                    style={{ maxWidth: 'min(100%, 400px)', maxHeight: '400px' }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Doctor message with reasoning and content
    return (
      <div className="mb-8">
        {/* Doctor/Reporter Avatar and Name */}
        <div className="flex items-center mb-2">
          {message.role === 'reporter' 
            ? (
              <div className="h-8 w-8 rounded-full bg-medical-green 
                text-white flex items-center justify-center mr-2">
                R
              </div>
              ) 
            : (
              <div className="h-8 w-8 rounded-full bg-medical-blue text-white flex items-center justify-center mr-2">
                D
              </div>
          )}

          {message.role === 'reporter' 
            ? (
              <div className="text-medical-green font-medium">
                {getText(translations.reporter, language)}
              </div>
              ) 
            : (
              <div className="text-medical-blue font-medium">
                {getText(translations.doctor, language)}
              </div>
          )}
          
          {message.isStreaming && (
            <div className="flex space-x-1 ml-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150" />
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-300" />
            </div>
          )}
        </div>

        {/* Reasoning Content (displayed as blockquote) */}
        {message.reasoning_content && (
          <div className="bg-gray-100 border-l-4 border-gray-300 rounded pl-4 pr-2 py-2 mb-4 overflow-auto">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mt-6 mb-3 border-b pb-1" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                  ),
                  hr: () => <hr className="border-t border-gray-300 my-4" />,
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-6 my-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-6 my-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                }}
              >
                {message.reasoning_content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Image rendering logic */}
        {message.images && message.images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {message.images.map((imgData, index) => {
              const isJPEG = imgData.startsWith("data:image/jpeg")
              const isWEBP = imgData.startsWith("data:image/webp")
              
              return (
                <div 
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={imgData}
                    alt={getText(translations.scanResult, language) + (index + 1)}
                    className={`w-full h-full object-cover ${
                      isJPEG ? 'bg-gray-100' : 'bg-white'
                    }`}
                    loading="lazy"
                  />
                  
                  {/* Image type identifier */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs">
                    {isJPEG ? '3D' : isWEBP ? '2D' : 'IMG'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Main Content */}
        {message.content && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mt-6 mb-3 border-b pb-1" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                  ),
                  hr: () => <hr className="border-t border-gray-300 my-4" />,
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-6 my-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-6 my-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Only show raw text if we don't have parsed content yet */}
        {!message.reasoning_content && !message.content && message.rawText && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-gray-600">{message.rawText}</p>
          </div>
        )}
      </div>
    );
  }
};

export default MessageRenderer;
