import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import Markdown from 'react-markdown';
import fetch from 'isomorphic-unfetch';

const Recipe = props => (
    <Layout>
      <h1>{props.show.name}</h1>
      <div className="markdown">
          <Markdown source={`
              This is our blog post.
              Yes. We can have a [link](/link).
              And we can have a title as well.
              
              ### This is a title
              
              And here's the content.
              `} />
      </div>
      <style jsx global>{`
        .markdown {
          font-family: 'Arial';
        }

        .markdown a {
          text-decoration: none;
          color: blue;
        }

        .markdown a:hover {
          opacity: 0.6;
        }

        .markdown h3 {
          margin: 0;
          padding: 0;
          text-transform: uppercase;
        }
      `}</style>
    </Layout>
  );
  
  Recipe.getInitialProps = async function(context) {
    const { title } = context.query;
    const res = await fetch(`https://api.tvmaze.com/shows/${title}`);
    const show = await res.json();
  
    console.log(`Fetched show: ${show.name}`);
  
    return { show };
  };
  
  export default Recipe;