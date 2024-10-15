import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface IReactQuill {
  value: string;
  onChange: (value: string) => void;
  className: string;
}

const NextQuillField = ({
  value,
  onChange,
  className,
  ...props
}: IReactQuill) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme="snow"
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ align: [] }],
          ['link', 'image'],
          ['clean'] // remove formatting button
        ]
      }}
      placeholder="Enter description here..."
      style={{ overflow: 'hidden', width: '100%' }}
      className={className}
      {...props}
    />
  );
};

export default NextQuillField;
