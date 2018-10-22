(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{216:function(e,t,a){e.exports=a(367)},221:function(e,t,a){},223:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},367:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),i=a(34),r=a.n(i),c=(a(221),a(25)),o=a(26),s=a(29),m=a(27),u=a(30),d=(a(223),a(377)),h=a(387),E=a(380),p=a(388),f=a(181),g=a(383),b=a(384),v=a(379),C=a(391),y=a(378),k=a(390),x=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleClick=function(e,t){t.index;a.setState({showMoreFeatures:!a.state.showMoreFeatures})},a.handleChange=function(e,t){a.setState(t)},a.state={activeIndex:-1,showMoreFeatures:!1,lat:51.505,lng:-.09,zoom:13},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){this.state.value;var e=[this.state.lat,this.state.lng];return l.a.createElement(d.a,{fluid:!0},l.a.createElement(h.a,{columns:"two"},l.a.createElement(h.a.Row,null,l.a.createElement(h.a.Column,{width:11,style:{padding:0}},l.a.createElement(v.a,{center:e,zoom:this.state.zoom,style:{height:"100%"}},l.a.createElement(C.a,{attribution:'&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),l.a.createElement(y.a,{position:e},l.a.createElement(k.a,null,"A pretty CSS3 popup. ",l.a.createElement("br",null)," Easily customizable")))),l.a.createElement(h.a.Column,{width:5,style:{padding:"5em 3em"}},l.a.createElement(E.a,{size:"large"},l.a.createElement(p.a,{as:"h2"},"Create new route",l.a.createElement(p.a.Subheader,null,"Enter route information")),l.a.createElement(E.a.Input,{fluid:!0,label:"Title",placeholder:"Title of the route",required:!0}),l.a.createElement(E.a.Input,{fluid:!0,label:"Description",placeholder:"Description of the route",required:!0}),l.a.createElement(E.a.Input,{fluid:!0,label:"Image",placeholder:"Upload image file",iconPosition:"left",icon:l.a.createElement(f.a,{name:"add",link:!0,inverted:!0,color:"black"})}),l.a.createElement(p.a,{as:"h4"},"Difficulty"),l.a.createElement(E.a.Group,{inline:!0},l.a.createElement(E.a.Radio,{label:"easy",name:"radioGroup",value:"easy",checked:"easy"===this.state.value,onChange:this.handleChange}),l.a.createElement(E.a.Radio,{label:"moderate",name:"radioGroup",value:"moderate",checked:"moderate"===this.state.value,onChange:this.handleChange}),l.a.createElement(E.a.Radio,{label:"difficult",name:"radioGroup",value:"difficult",checked:"difficult"===this.state.value,onChange:this.handleChange})),l.a.createElement(p.a,{size:"small"},"Features"),l.a.createElement(E.a.Group,{widths:"equal"},l.a.createElement(E.a.Checkbox,{label:"Kid-Friendly"}),l.a.createElement(E.a.Checkbox,{label:"Dogs Allowed"})),l.a.createElement(E.a.Group,{widths:"equal"},l.a.createElement(E.a.Checkbox,{label:"Forest"}),l.a.createElement(E.a.Checkbox,{label:"Lake"})),l.a.createElement(E.a.Group,{widths:"equal"},l.a.createElement(E.a.Checkbox,{label:"River"}),l.a.createElement(E.a.Checkbox,{label:"Wineyard"})),l.a.createElement(g.a,null,l.a.createElement(g.a.Title,{active:this.state.showMoreFeatures,index:0,onClick:this.handleClick},l.a.createElement(f.a,{name:"dropdown"}),"More"),l.a.createElement(g.a.Content,{active:this.state.showMoreFeatures},l.a.createElement("p",null,"More features as you click. This will also be in a grid I assume"))),l.a.createElement("p",null),l.a.createElement(b.a,{color:"blue"},"Save"))))))}}]),t}(n.Component),w=(n.Component,a(381)),q=a(392),S=a(180),O=a(382),j=a(124),I=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).handleChange=function(e,t){a.setState(t)},a.handleValueChange=function(e,t){var n=t.value;a.setState({value:n})},a.onSearchChanged=function(e,t){a.setState({searchText:t.value})},a.onSearch=function(e,t){a.setState({searched:!0})},a.onSearchResultClick=function(e){a.setState({showDetail:e})},a.state={lat:51.505,lng:-.09,zoom:13,difficulty:0,routeLength:5,searchText:"",searched:!1,showDetail:-1},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this,t=[this.state.lat,this.state.lng],a=[{id:1,title:"Wanderweg 1",address:"Speyer, RLP, Deutschland",distance:4,difficulty:"moderate",rating:4,image:"./static/media/RiceTerraces.JPG"},{id:2,title:"Wanderweg 2",address:"Speyer, RLP, Deutschland",distance:8,difficulty:"easy",rating:2,image:"./static/media/RiceTerraces.JPG"}],n=[];this.state.searched&&a.forEach(function(t){n.push(l.a.createElement(w.a,{onClick:function(){return e.onSearchResultClick(t.id)}},l.a.createElement(w.a.Image,{size:"small",src:t.image}),l.a.createElement(w.a.Content,null,l.a.createElement(w.a.Header,{as:"h4"}," ",t.title," "),l.a.createElement(w.a.Description,null,t.address,l.a.createElement("p",null),"Distance:",t.distance," km",l.a.createElement("p",null),"Difficulty: ",t.difficulty,l.a.createElement(w.a.Extra,null,l.a.createElement(q.a,{icon:"star",defaultRating:t.rating,maxRating:5,disabled:!0}))))))});var i=a.find(function(t){return t.id===e.state.showDetail});return l.a.createElement(d.a,{fluid:!0},l.a.createElement(h.a,{columns:"two"},l.a.createElement(h.a.Row,null,l.a.createElement(h.a.Column,{width:11,style:{padding:0}},l.a.createElement(v.a,{center:t,zoom:this.state.zoom,style:{height:"100%"}},l.a.createElement(C.a,{attribution:'&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),l.a.createElement(y.a,{position:t},l.a.createElement(k.a,null,"A pretty CSS3 popup. ",l.a.createElement("br",null)," Easily customizable")))),l.a.createElement(h.a.Column,{width:5,style:{padding:"5em 3em"}},this.state.showDetail<=-1?l.a.createElement("div",null,l.a.createElement(E.a,{size:"large"},l.a.createElement(p.a,{as:"h2"},"Find a trail / Search for a route"),l.a.createElement(E.a.Input,{fluid:!0,placeholder:"Enter area, city or landmark",onChange:this.onSearchChanged,action:{icon:"search",onClick:this.onSearch}}),l.a.createElement(p.a,{as:"h4"},l.a.createElement(f.a,{name:"filter"}),l.a.createElement(p.a.Content,null," Filter ")),l.a.createElement(p.a.Subheader,{as:"h5"}," Difficulty"),l.a.createElement(E.a.Group,{inline:!0},l.a.createElement(E.a.Radio,{label:"easy",name:"radioGroup",value:"easy",checked:"easy"===this.state.difficulty,onChange:this.handleChange}),l.a.createElement(E.a.Radio,{label:"moderate",name:"radioGroup",value:"moderate",checked:"moderate"===this.state.difficulty,onChange:this.handleChange}),l.a.createElement(E.a.Radio,{label:"difficult",name:"radioGroup",value:"difficult",checked:"difficult"===this.state.difficulty,onChange:this.handleChange})),l.a.createElement(p.a,{as:"h4"}," Route length in km: Routes up to",l.a.createElement(S.a,{color:"blue"},this.state.routeLength)," km "),l.a.createElement(j.Slider,{color:"blue",inverted:!1,settings:{start:this.state.routeLength,min:0,max:25,step:1,onChange:function(t){return e.setState({routeLength:t})}}})),this.state.searched&&l.a.createElement("div",null,l.a.createElement(h.a,{columns:"equal"},l.a.createElement(h.a.Column,{textAlign:"left"},l.a.createElement(f.a,{name:"list"})," ",a.length," results"),l.a.createElement(h.a.Column,{textAlign:"right"},l.a.createElement(O.a,{text:"Sort By",direction:"left"},l.a.createElement(O.a.Menu,null,l.a.createElement(O.a.Item,{text:"Relevance"}),l.a.createElement(O.a.Item,{text:"Most popular"}),l.a.createElement(O.a.Item,{text:"Most recently updated"}))))),l.a.createElement(w.a.Group,{divided:!0,link:!0},n))):l.a.createElement(E.a,null,i.title)))))}}]),t}(n.Component),R=a(393),T=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).onSubmitForm=function(){},a.state={loggedIn:!1},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement(h.a,{textAlign:"center",style:{height:"100%"},verticalAlign:"middle"},l.a.createElement(h.a.Column,{style:{maxWidth:450}},l.a.createElement(p.a,{as:"h2",color:"blue",textAlign:"center"},"Login to your account"),l.a.createElement(E.a,{size:"large",onSubmit:this.onSubmitForm},l.a.createElement(R.a,{stacked:!0},l.a.createElement(E.a.Input,{fluid:!0,icon:"user",iconPosition:"left",placeholder:"E-mail address"}),l.a.createElement(E.a.Input,{fluid:!0,icon:"lock",iconPosition:"left",placeholder:"Password",type:"password"}),l.a.createElement(E.a.Field,null,l.a.createElement("a",{href:"#"},"Forgot your password?")),l.a.createElement(b.a,{color:"blue",fluid:!0,size:"large"},"Login"))),l.a.createElement(E.a.Field,null,"Don't have an account? ",l.a.createElement("a",{href:"#"},"Sign Up"))))}}]),t}(n.Component),A=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,l=new Array(n),i=0;i<n;i++)l[i]=arguments[i];return(a=Object(s.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(l)))).state={activeIndex:-1},a.handleClick=function(e,t){var n=t.index,l=a.state.activeIndex===n?-1:n;a.setState({activeIndex:l})},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this.state.activeIndex;return l.a.createElement(d.a,null,l.a.createElement(p.a,{as:"h2"},"FAQ"),l.a.createElement(g.a,{block:!0,fluid:!0,styled:!0},l.a.createElement(g.a.Title,{active:0===e,index:0,onClick:this.handleClick},"Most frequently asked quesion 1",l.a.createElement(p.a,{as:"h5",floated:"right"}," ",l.a.createElement(f.a,{name:"add"})," ")),l.a.createElement(g.a.Content,{active:0===e},l.a.createElement("p",null,"Answer to Q1")),l.a.createElement(g.a.Title,{active:1===e,index:1,onClick:this.handleClick},"Most frequently asked quesion 2",l.a.createElement(p.a,{as:"h5",floated:"right"}," ",l.a.createElement(f.a,{name:"add"})," ")),l.a.createElement(g.a.Content,{active:1===e},l.a.createElement("p",null,"Answer to Q2")),l.a.createElement(g.a.Title,{active:2===e,index:2,onClick:this.handleClick},"Most frequently asked quesion 3",l.a.createElement(p.a,{as:"h5",floated:"right"}," ",l.a.createElement(f.a,{name:"add"})," ")),l.a.createElement(g.a.Content,{active:2===e},l.a.createElement("p",null,"Answer to Q3. This is the following: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")),l.a.createElement(g.a.Title,{active:3===e,index:3,onClick:this.handleClick},"Most frequently asked quesion 4",l.a.createElement(p.a,{as:"h5",floated:"right"}," ",l.a.createElement(f.a,{name:"add"})," ")),l.a.createElement(g.a.Content,{active:3===e},l.a.createElement("p",null,"Answer to Q4. This is the following: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")),l.a.createElement(g.a.Title,{active:4===e,index:4,onClick:this.handleClick},"Most frequently asked quesion 5",l.a.createElement(p.a,{as:"h5",floated:"right"}," ",l.a.createElement(f.a,{name:"add"})," ")),l.a.createElement(g.a.Content,{active:4===e},l.a.createElement("p",null,"Answer to Q5. This is the following: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")),l.a.createElement(g.a.Title,{active:5===e,index:5,onClick:this.handleClick},"Most frequently asked quesion 6",l.a.createElement(p.a,{as:"h5",floated:"right"}," ",l.a.createElement(f.a,{name:"add"})," ")),l.a.createElement(g.a.Content,{active:5===e},l.a.createElement("p",null,"Answer to Q6. This is the following: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."))))}}]),t}(n.Component),D=a(203),G=(a(351),function(e){function t(){return Object(c.a)(this,t),Object(s.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement(D.Carousel,{autoPlay:!0,showArrows:!0,infiniteLoop:!0,useKeyboardArrows:!0},l.a.createElement("div",null,l.a.createElement("img",{src:"./static/media/RiceTerraces.JPG"})),l.a.createElement("div",null,l.a.createElement("img",{src:"./static/media/EndChineseWall.JPG"}),l.a.createElement("p",{className:"legend"},"Legend 2")),l.a.createElement("div",null,l.a.createElement("img",{src:"./static/media/RiceTerraces.JPG"}),l.a.createElement("p",{className:"legend"},"Legend 3")),l.a.createElement("div",null,l.a.createElement("img",{src:"./static/media/EndChineseWall.JPG"}),l.a.createElement("p",{className:"legend"},"Legend 4")))}}]),t}(n.Component)),L=a(385),M=a(386),F=a(389),z=a(369),P=function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(s.a)(this,Object(m.a)(t).call(this,e))).state={},a}return Object(u.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){return l.a.createElement(M.a,null,l.a.createElement("div",null,l.a.createElement(L.a,{icon:"labeled",style:{marginBottom:"0"}},l.a.createElement(L.a.Item,{name:"home",as:F.a,exact:!0,to:"/"},l.a.createElement(f.a,{name:"home"}),"Home"),l.a.createElement(L.a.Item,{name:"search",as:F.a,exact:!0,to:"/search"},l.a.createElement(f.a,{name:"search"}),"Search"),l.a.createElement(L.a.Item,{name:"create",as:F.a,exact:!0,to:"/create"},l.a.createElement(f.a,{name:"pencil"}),"Create"),l.a.createElement(L.a.Item,{name:"logo"},l.a.createElement(f.a,{name:"tree"}),"Name"),l.a.createElement(L.a.Item,{position:"right",name:"user",as:F.a,exact:!0,to:"/user"},l.a.createElement(f.a,{name:"user"}),"LogIn"),l.a.createElement(L.a.Item,{name:"help",as:F.a,exact:!0,to:"/help"},l.a.createElement(f.a,{name:"help"}),"FAQ")),l.a.createElement(R.a,{vertical:!0,className:"content",style:{padding:0}},l.a.createElement(z.a,{exact:!0,path:"/",component:G}),l.a.createElement(z.a,{path:"/search",component:I}),l.a.createElement(z.a,{path:"/create",component:x}),l.a.createElement(z.a,{path:"/user",component:T}),l.a.createElement(z.a,{path:"/help",component:A}))))}}]),t}(n.Component);a(365);r.a.render(l.a.createElement(P,null),document.getElementById("root"))}},[[216,2,1]]]);
//# sourceMappingURL=main.c6b09d53.chunk.js.map