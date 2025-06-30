
import { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, height = "400px" }: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const handleImageUpload = (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      // في الوقت الحالي سنستخدم data URL
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => reject('فشل في رفع الصورة');
      reader.readAsDataURL(blobInfo.blob());
    });
  };

  return (
    <div className="w-full" dir="rtl">
      <Editor
        ref={editorRef}
        apiKey="2uibwmvxe3qeqqwn7al4jw9rd1xkvgmbq4hzv76dpqriwus5"
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: parseInt(height),
          menubar: true,
          direction: 'rtl',
          language: 'ar',
          // إضافة النطاقات المسموحة
          referrer_policy: 'origin',
          convert_urls: false,
          // التأكد من عمل الخطوط العربية
          content_css: [
            'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap'
          ],
          content_style: `
            body { 
              font-family: 'IBM Plex Sans Arabic', 'Amiri', 'Cairo', 'Tajawal', Arial, sans-serif; 
              font-size: 16px; 
              direction: rtl; 
              text-align: right;
              line-height: 1.6;
              color: #333;
              margin: 10px;
            }
            * {
              direction: rtl !important;
            }
            p, div, span, h1, h2, h3, h4, h5, h6, li, td, th {
              direction: rtl !important;
              text-align: right !important;
            }
            img, video, audio {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 10px auto;
              border-radius: 8px;
            }
            .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
              direction: rtl;
              text-align: right;
            }
            blockquote {
              border-right: 4px solid #ddd;
              border-left: none;
              margin: 0;
              padding: 10px 20px;
              font-style: italic;
              background: #f9f9f9;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 10px 0;
            }
            table td, table th {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: right;
            }
            table th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .emoji {
              font-size: 1.2em;
            }
            code {
              background: #f4f4f4;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: monospace;
            }
            pre {
              background: #f4f4f4;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
              direction: ltr !important;
              text-align: left !important;
            }
            hr {
              border: none;
              border-top: 2px solid #ddd;
              margin: 20px 0;
            }
          `,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'directionality', 'emoticons', 'pagebreak', 'nonbreaking',
            'save', 'textpattern', 'autosave', 'autoresize', 'importcss'
          ],
          toolbar1: 'undo redo | bold italic underline strikethrough | fontfamily fontsize forecolor backcolor',
          toolbar2: 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | blockquote hr',
          toolbar3: 'link image media table | emoticons charmap | code codesample | fullscreen preview',
          toolbar4: 'ltr rtl | visualblocks | searchreplace | save | help',
          
          toolbar_mode: 'wrap',
          
          // تحسين أحجام الخطوط
          fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 32pt 36pt 48pt 60pt 72pt',
          
          // الخطوط العربية المحسنة
          font_family_formats: `
            IBM Plex Sans Arabic=IBM Plex Sans Arabic,sans-serif;
            أميري=Amiri,serif;
            القاهرة=Cairo,sans-serif;
            تجوال=Tajawal,sans-serif;
            Arial=arial,helvetica,sans-serif;
            Helvetica=helvetica,arial,sans-serif;
            Times New Roman=times new roman,times,serif;
            Courier New=courier new,courier,monospace;
            Verdana=verdana,geneva,sans-serif;
            Georgia=georgia,palatino,serif;
            Trebuchet MS=trebuchet ms,geneva,sans-serif;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Impact=impact,chicago,sans-serif;
            Comic Sans MS=comic sans ms,sans-serif
          `,
          
          // تنسيقات الكتل بالعربية
          block_formats: 'فقرة=p; عنوان 1=h1; عنوان 2=h2; عنوان 3=h3; عنوان 4=h4; عنوان 5=h5; عنوان 6=h6; مُنسق مسبقاً=pre; اقتباس=blockquote; قسم=div',
          
          // ألوان مخصصة للنص العربي
          color_map: [
            '000000', 'أسود',
            'FFFFFF', 'أبيض', 
            'FF0000', 'أحمر',
            '00FF00', 'أخضر',
            '0000FF', 'أزرق',
            'FFFF00', 'أصفر',
            'FF00FF', 'بنفسجي',
            '00FFFF', 'سماوي',
            '800000', 'أحمر داكن',
            '008000', 'أخضر داكن',
            '000080', 'أزرق داكن',
            '808000', 'زيتوني',
            '800080', 'بنفسجي داكن',
            '008080', 'أزرق مخضر',
            'C0C0C0', 'فضي',
            '808080', 'رمادي',
            'FF6B6B', 'أحمر فاتح',
            '4ECDC4', 'أخضر مائي',
            '45B7D1', 'أزرق فاتح',
            'F9CA24', 'أصفر ذهبي',
            'F0932B', 'برتقالي',
            'EB4D4B', 'أحمر كرزي',
            '6C5CE7', 'بنفسجي فاتح',
            'A29BFE', 'بنفسجي ناعم'
          ],
          
          placeholder: placeholder || 'ابدأ الكتابة هنا...',
          branding: false,
          resize: true,
          autoresize_bottom_margin: 16,
          max_height: 800,
          min_height: parseInt(height),
          
          // إعدادات الصور والوسائط محسنة
          image_advtab: true,
          image_caption: true,
          image_title: true,
          automatic_uploads: true,
          images_upload_handler: handleImageUpload,
          file_picker_types: 'image media',
          
          // إعدادات الفيديو والصوت
          media_live_embeds: true,
          media_alt_source: false,
          media_poster: false,
          
          // إعدادات متقدمة للصور
          image_dimensions: true,
          object_resizing: true,
          
          // إعدادات اللصق المحسنة
          paste_data_images: true,
          paste_as_text: false,
          paste_webkit_styles: 'none',
          paste_remove_styles_if_webkit: false,
          paste_merge_formats: true,
          smart_paste: true,
          
          // العناصر المسموحة - محسنة
          extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style],video[*],audio[*],source[*],iframe[*],embed[*],object[*]',
          custom_elements: '~img,~video,~audio,~source,~iframe,~embed,~object',
          valid_children: '+body[style],+div[img|video|audio|iframe]',
          
          // إعدادات الجداول المحسنة
          table_appearance_options: true,
          table_grid: true,
          table_tab_navigation: true,
          table_default_attributes: {
            'border': '1',
            'style': 'border-collapse: collapse; width: 100%;'
          },
          table_default_styles: {
            'border-collapse': 'collapse',
            'width': '100%'
          },
          
          // إعدادات الكود
          codesample_languages: [
            {text: 'HTML/XML', value: 'markup'},
            {text: 'JavaScript', value: 'javascript'},
            {text: 'CSS', value: 'css'},
            {text: 'PHP', value: 'php'},
            {text: 'Ruby', value: 'ruby'},
            {text: 'Python', value: 'python'},
            {text: 'Java', value: 'java'},
            {text: 'C', value: 'c'},
            {text: 'C#', value: 'csharp'},
            {text: 'C++', value: 'cpp'},
            {text: 'SQL', value: 'sql'},
            {text: 'JSON', value: 'json'}
          ],
          
          // إعدادات الحفظ التلقائي
          autosave_ask_before_unload: true,
          autosave_interval: '30s',
          autosave_retention: '2m',
          
          // إعدادات البحث والاستبدال
          searchreplace_filter_node: (node: any) => {
            return node.nodeName.toLowerCase() !== 'script';
          },
          
          // إعدادات النص المنسق
          textpattern_patterns: [
            {start: '*', end: '*', format: 'italic'},
            {start: '**', end: '**', format: 'bold'},
            {start: '#', format: 'h1'},
            {start: '##', format: 'h2'},
            {start: '###', format: 'h3'},
            {start: '####', format: 'h4'},
            {start: '#####', format: 'h5'},
            {start: '######', format: 'h6'},
            {start: '1. ', cmd: 'InsertOrderedList'},
            {start: '* ', cmd: 'InsertUnorderedList'},
            {start: '- ', cmd: 'InsertUnorderedList'}
          ],
          
          // إعدادات الإيموجي
          emoticons_database: 'emojiimages',
          
          setup: (editor: any) => {
            editor.on('init', () => {
              editor.getDoc().dir = 'rtl';
              editor.getBody().style.direction = 'rtl';
              editor.getBody().style.textAlign = 'right';
              editor.getBody().style.fontFamily = 'IBM Plex Sans Arabic, Arial, sans-serif';
            });
            
            // إضافة أزرار مخصصة
            editor.ui.registry.addButton('rtltext', {
              text: 'من اليمين لليسار',
              onAction: () => {
                editor.execCommand('mceDirectionRTL');
              }
            });
            
            editor.ui.registry.addButton('ltrtext', {
              text: 'من اليسار لليمين', 
              onAction: () => {
                editor.execCommand('mceDirectionLTR');
              }
            });
          }
        }}
      />
    </div>
  );
};

export default RichTextEditor;
