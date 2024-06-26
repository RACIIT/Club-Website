
import React, { useState, useEffect } from 'react';

import Footer2 from '../components/footer/Footer2';

import img5 from '../assets/images/blog/next-post.jpg'
import { Link, useParams } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react'
import client from '../services/client'
import Loading from '../components/loader/loader';
import FacebookBox from '../components/facebook_box/FacebookBox';
import YouTubePlayer from 'react-player/youtube';

const builder = imageUrlBuilder(client);


function urlFor(source) {
    return builder.image(source);
}

export function getTimeDifference(publishDate) {
    const currentDate = new Date();
    const publishDateObj = new Date(publishDate);

    const timeDifference = currentDate - publishDateObj;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(monthsDifference / 12);

    if (yearsDifference >= 1) {
        return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } else if (monthsDifference >= 1) {
        return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else if (daysDifference >= 1) {
        return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else {
        return 'Today';
    }
}


export const getApiResults = async (slug) => {
    try {
        const combinedQuery = `
        {
          "postDetails": *[slug.current == "${slug}"]{
            "current": { 
              "slug": slug.current, 
              title, 
              publishedAt,
              "facebookLink": facebookLink,
              "author": author->{
                name,
                slug,
              },
              "category": category->{
                "color": color.hex,
                title,
                slug
              },
              mainImage{
                asset->{
                  _id,
                  url
                }
              },
              body
            },
            "previous": *[_type == "post" && (publishedAt < ^.publishedAt || (publishedAt == ^.publishedAt && slug.current < ^.slug.current))]|order(publishedAt desc, slug.current desc)[0]{ 
                "slug": slug.current, 
                title,
                "mainImage": mainImage.asset->{
                  url
                }
              },
              "next": *[_type == "post" && (publishedAt > ^.publishedAt || (publishedAt == ^.publishedAt && slug.current > ^.slug.current))]|order(publishedAt asc, slug.current asc)[0]{ 
                "slug": slug.current, 
                title,
                "mainImage": mainImage.asset->{
                  url
                }
              },
          }|order(publishedAt)[0],
  
          "categoriesData": *[_type == "category"]{
            slug,
            title,
            "postcount": count(*[_type == "post" && references(^._id)])
          } | order(title asc),
  
          "latestPosts": *[_type == "post"]{
            title,
            slug,
            publishedAt,
            "category": category->{
              title,
              slug
            },
            mainImage{
              asset->{
                _id,
                url
              }
            },
          }[0...4] | order(publishedAt desc)
        }
      `;
        const response = await client.fetch(combinedQuery);
        console.log('Combined Data:', response);

        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

}

function BlogDetails(props) {
    const [singlePost, setSinglePost] = useState(null);
    const [catogaries, setcatogaries] = useState(null)
    const [latestPosts, setLatestPosts] = useState(null)
    const { slug } = useParams();

    const serializers = {
        types: {
            youtube: ({ node }) => {
                const { url } = node;
                return (
                    url && (
                        <div
                            className='container'
                            style={{
                                position: 'relative',
                                paddingBottom: '56.25%', // 16:9 aspect ratio
                                height: 0,
                                overflow: 'hidden',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Added elevation
                                margin: '7rem 0', // Added margin top and bottom
                            }}
                        >
                            <YouTubePlayer
                                url={url}
                                width={'80%'}
                                height={'100%'}
                                style={{
                                    display: 'block',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        </div>
                    )

                );
            },
            image: ({ node }) => {
                console.log("iamge>>>>", node.asset)
                if (node.asset === undefined) {
                    return;
                }
                const imageUrl = urlFor(node.asset).width(1000).auto('format').url();

                return (
                    node.asset?._ref && (<img
                        src={imageUrl}
                        alt="Description"
                        style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            maxWidth: '100%',
                            height: 'auto',
                            marginTop: '5rem',
                            marginBottom: '5rem',
                            paddingLeft: '2rem',
                            paddingRight: '2rem',
                        }}
                    />)
                );
            },
        },
    };


    useEffect(() => {
        async function fetchData() {
            getApiResults(slug).then((data) => {
                setSinglePost(data.postDetails)
                setcatogaries(data.categoriesData)
                setLatestPosts(data.latestPosts)
            });
        };
        fetchData()
    }, [slug]);


    if (singlePost && catogaries && latestPosts) {
        return (
            <div>
                <section className="tf-blog">
                    <div className="tf-container">
                        <div className="row">
                            <div className="col-xl-9 col-lg-8 col-md-12">
                                <div className="detail-inner">
                                    <div className="image">
                                        <img style={{
                                            width: '100%',
                                            objectFit: 'cover',   // Cover mode
                                        }} src={urlFor(singlePost.current.mainImage.asset).auto('format').url()} alt="Tell" />
                                    </div>

                                    <div className="title">
                                        <h3 className='blogTitle' >{singlePost.current.title}</h3>
                                        <div className="category" style={{ backgroundColor: `${singlePost.current.category.color}` }}>{singlePost.current.category.title}</div>
                                    </div>
                                    <div className="meta">
                                        <span className="admin"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0C8.51067 0 5.67188 2.8388 5.67188 6.32812C5.67188 9.81745 8.51067 12.6562 12 12.6562C15.4893 12.6562 18.3281 9.81745 18.3281 6.32812C18.3281 2.8388 15.4893 0 12 0Z" fill="#ED3659" />
                                            <path d="M19.8734 16.7904C18.1409 15.0313 15.8442 14.0625 13.4062 14.0625H10.5938C8.15588 14.0625 5.85909 15.0313 4.12659 16.7904C2.40258 18.5409 1.45312 20.8515 1.45312 23.2969C1.45312 23.6852 1.76794 24 2.15625 24H21.8438C22.2321 24 22.5469 23.6852 22.5469 23.2969C22.5469 20.8515 21.5974 18.5409 19.8734 16.7904Z" fill="#ED3659" />
                                        </svg>
                                        <p> {singlePost.current.author.name}</p>
                                           </span>
                                        <span className="date"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 9C2 7.11438 2 6.17157 2.58579 5.58579C3.17157 5 4.11438 5 6 5H18C19.8856 5 20.8284 5 21.4142 5.58579C22 6.17157 22 7.11438 22 9C22 9.4714 22 9.70711 21.8536 9.85355C21.7071 10 21.4714 10 21 10H3C2.5286 10 2.29289 10 2.14645 9.85355C2 9.70711 2 9.4714 2 9Z" fill="#ED3659" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M2.58579 21.4142C2 20.8284 2 19.8856 2 18V13C2 12.5286 2 12.2929 2.14645 12.1464C2.29289 12 2.5286 12 3 12H21C21.4714 12 21.7071 12 21.8536 12.1464C22 12.2929 22 12.5286 22 13V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22H6C4.11438 22 3.17157 22 2.58579 21.4142ZM8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H8Z" fill="#ED3659" />
                                            <path d="M7 3L7 6" stroke="#ED3659" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M17 3L17 6" stroke="#ED3659" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <p>{getTimeDifference(singlePost.current.publishedAt)}</p>
                                          </span>
                                    </div>

                                    <div className="content-inner mb24" style={{ textAlign: window.innerWidth > 768 ? 'justify' : 'left' }}>
                                        <BlockContent blocks={singlePost.current.body} projectId={'eeksv8lg'} dataset={'production'} serializers={serializers} />

                                        {/* <Body blocks={singlePost.current.body}/> */}
                                        {/* <p>The Basilisks that players collect are represented with NFTs on Ethereum’s blockchain with real-world value. Players use the Basilisks they have gathered to battle other players to win ether (ETH).</p>
                                        <p>In Balthazar Dragons, players are immersed in a 3D open world to explore and capture dragon-like beasts called Basilisks.  Balthazar Dragons is an upcoming fantasy role-playing game developed on the Ethereum blockchain by a decentralized autonomous organization (DAO) called the Balthazar DAO.</p> */}
                                        {singlePost.current.facebookLink && <FacebookBox link={singlePost.current.facebookLink} />}

                                    </div>


                                    {/* <div className="post-infor">
                                        <div className="title">“The First Huge Metaverse Arena To Arrange Live Sports, Hang Out And Even Make Bets And Wagers”</div>
                                        <div className="content">
                                            <div className="star"><i className="fas fa-star"></i><span>8.5/ 10</span></div>
                                            <h6 className="name">Markout Corporation</h6>
                                        </div>
    
                                    </div> */}

                                    {/* <div className="image style-2">
                                        <img className="mr20" src={img2} alt="RACIIT" />
                                        <img src={img3} alt="RACIIT" />
                                    </div> */}
                                    {/* <div className="content-inner">
                                        <h4 className="title">NFTs Are Digital Assets That Represent Real-world Objects</h4>
                                        <p className="mb13">Setting up your avatar and personalizing your nickname on Binance is quick and easy. Users can go to binance.com under Dashboard Settings My Profile Avatar and Nickname. For those of you who own NFT assets, you can select the NFT you want to use from your collection as your avatar to personalize your profile. For users who do not own any NFT avatars, check out the NFT avatar collections page to get started.</p>
                                        <p>Alternatively, if you are on nft.binance.com, go to User Center Settings Basic Set Avatar and Nickname, and you all be redirected to the main site. Binance NFT Creators have the option of setting their Avatars on nft.binance.com. Once you set your new unique nickname, it will be standardized and used across the Binance ecosystem.</p>
                                    </div>
        
                                    <div className="content-inner ">
                                        <h6 className="title">NFT Avatar Generators</h6>
                                        <p>You can find a range of NFT marketplaces where you can buy existing NFTs or list your own NFTs for sale.</p>
                                    </div> */}
                                    <div className="content-bottom">
                                        <div className="widget widget-tag">
                                            {/* <h6 className="widget-title">CATOGARIES:</h6>
                                            <ul>
                                                <li><Link to="#" >ICO</Link></li>
                                                <li><Link to="#" >CYPPUNK</Link></li>
                                                <li><Link to="#" >LIGHT</Link></li>
                                            </ul> */}
                                        </div>
                                        {/* <div className="widget widget-socical">
                                            <h6 className="widget-title">SHARE:</h6>
                                            <ul>
                                                <li><Link to="#" className="fab fa-facebook"></Link></li>
                                                <li><Link to="#" className="fab fa-instagram"></Link></li>
                                                <li><Link to="#" className="fab fa-youtube"></Link></li>
                                            </ul>

                                        </div> */}

                                    </div>

                                    <ul className="post-navigator">
                                        {singlePost.previous != null ?
                                            (<li>
                                                <div className="thump">
                                                    {singlePost ? (
                                                        <img
                                                            src={urlFor(singlePost.previous.mainImage.url).fit('crop').auto('format').url()}
                                                            alt="Next Post"
                                                            style={{
                                                                width: '12rem', // Set width to 8rem
                                                                height: '10rem', // Set height to 8rem
                                                                objectFit: 'cover', // Cover the entire space
                                                                borderRadius: '0.5rem' // Optional: Add a border radius for rounded corners
                                                            }}
                                                        />
                                                    ) : (
                                                        <img src={img5} alt="PreviosPost" />
                                                    )}
                                                </div>
                                                <div className="content">
                                                    <Link to={"/blog/" + singlePost.previous.slug} key={singlePost.previous.slug} className="btn-post btn-prev">PREVIOUS</Link>
                                                    <h6 className="title"><Link to={"/blog/" + singlePost.previous.slug} key={singlePost.previous.slug} >{singlePost.previous.title}</Link></h6>
                                                </div>
                                            </li>) : (
                                                <div className="thump">
                                                </div>
                                            )}
                                        {singlePost.next != null && (<li>
                                            <div className="thump">
                                                {singlePost ? (
                                                    <img
                                                        src={urlFor(singlePost.next.mainImage.url).fit('crop').auto('format').url()}
                                                        alt="Next Post"
                                                        style={{
                                                            width: '12rem', // Set width to 8rem
                                                            height: '10rem', // Set height to 8rem
                                                            objectFit: 'cover', // Cover the entire space
                                                            borderRadius: '0.5rem' // Optional: Add a border radius for rounded corners
                                                        }}
                                                    />
                                                ) : (
                                                    <img src={img5} alt="next Post" />
                                                )}
                                            </div>
                                            <div className="content">
                                                <Link to={"/blog/" + singlePost.next.slug} key={singlePost.next.slug} className="btn-post btn-next">NEXT</Link>
                                                <h6 className="title"><Link to={"/blog/" + singlePost.next.slug} key={singlePost.next.slug}>{singlePost.next.title}</Link></h6>
                                            </div>
                                        </li>)}
                                    </ul>

                                    {/* <div id="comments">
                                        <h3 className="heading">LEAVE A REPLY</h3>
                                        <div className="sub-heading">Your email address will not be published. Required fields are marked</div>
                                        <form action="contact/contact-process.php" method="post" id="commentform"  className="comment-form">
                                            <fieldset className="name"><input type="text" id="name" placeholder="Name*" className="tb-my-input" name="name" tabIndex="2" aria-required="true" required="" /></fieldset>    
                                            <fieldset className="email"><input type="email" id="email" placeholder="Enter your email*" className="tb-my-input" name="email" tabIndex="2" aria-required="true" required="" /></fieldset>
                                            <fieldset className="phone"><input type="text" id="phone" placeholder="Phone Number*" className="tb-my-input" name="phone" tabIndex="2" aria-required="true" required="" /></fieldset>    
                                            <fieldset className="website"><input type="text" id="website" placeholder="Website" className="tb-my-input" name="website" tabIndex="2" aria-required="true" required="" /></fieldset>
                                            <fieldset className="message"><textarea id="message" name="message" rows="4" placeholder="Comment*" tabIndex="4" aria-required="true" required=""></textarea></fieldset><div className="btn-submit mg-t-36"><button className="tf-button" type="submit">SEND COMMENT</button></div></form>
                                            </div> */}
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-12">
                                <div className="side-bar">
                                    <div className="widget widget-category">
                                        <h4 className="widget-title">CATEGORIES</h4>
                                        {/*    CALL AN API FOR THIS TO GET THE APIS AND USING THTA GET DIRECTED TO A THE LIST */}
                                        <ul>
                                            {catogaries.map((category, index) => (
                                                <li key={index}>
                                                    <Link to={"/avenueDetail/" + category.slug.current} key={category.slug.current}>{`${category.title} (${category.postcount})`}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="widget widget-recent-post">
                                        <h4 className="widget-title">RECENT POSTS</h4>
                                        <ul>

                                            {
                                                latestPosts.map(post => (
                                                    <li key={post.slug.current}>
                                                        <div className="post-img">
                                                            <img
                                                                src={urlFor(post.mainImage.asset.url).fit('crop').auto('format').url()}
                                                                alt="Post New"
                                                                style={{
                                                                    width: '12rem',       // Fixed width
                                                                    height: '9rem',       // Fixed height
                                                                    objectFit: 'cover',   // Cover mode
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="post-content">
                                                            <h6 className="title"><Link to={"/blog/" + post.slug.current} key={post.slug.current}>{post.title}</Link></h6>
                                                            <div className="post-meta">

                                                                <span className="date">{getTimeDifference(post.publishedAt)}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                    {/* <div className="widget widget-tag ">
                                        <h4 className="widget-title">CATOGARIES</h4>
                                    
                                        <ul>
                                            <li><Link to="#">NFT</Link></li>
                                            <li><Link to="#">ICO</Link></li>
                                            <li><Link to="#">CYPTO</Link></li>
                                            <li><Link to="#">LAUCHPAD</Link></li>
                                            <li><Link to="#">Robot</Link></li>
                                            <li><Link to="#">Gamming</Link></li>
                                            <li><Link to="#">Meraverse</Link></li>
                                        </ul>
                                    </div> */}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                <Footer2 />

            </div>
        );

    } else {
        return (<Loading />);
    }


}

export default BlogDetails;

// {
//     "title": "Parallax 2023",
//     "slug": {
//         "_type": "slug",
//         "current": "parallax-2023"
//     },
//     "publishedAt": "2024-04-12T20:26:00.000Z",
//     "category": null,
//     "mainImage": {
//         "asset": {
//             "_id": "image-352ea20ff42f4bf97fb2794e14fb5a542b9fc867-768x519-png",
//             "url": "https://cdn.sanity.io/images/eeksv8lg/production/352ea20ff42f4bf97fb2794e14fb5a542b9fc867-768x519.png"
//         }
//     }
// }

