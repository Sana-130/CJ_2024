import Parse from 'parse/dist/parse.min.js';
import qs from 'qs'
import { useData } from "./context/DataContext"

const PARSE_APPLICATION_ID = import.meta.env.REACT_APP_APPLICATION_ID;
const PARSE_HOST_URL = import.meta.env.REACT_APP_HOST_URL;
const PARSE_JAVASCRIPT_KEY = import.meta.env.REACT_APP_JAVASCRIPT_KEY;

Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);
Parse.serverURL = PARSE_HOST_URL;


export const fetchQues = async() => {
    const parseQuery = new Parse.Query("questions");
    //const query = new Parse.Query(Question);
  

    //parseQuery.select(['title', 'complexity']);
  
    try {
      const results = await parseQuery.find();

      const resultObj= {};
      results.forEach(item => {
        resultObj[item.id] = item;
        let inp = item.get('input');
        console.log(qs.parse(inp));
        //console.log(qs.parse());
      });
      
     /* const questionsData = results.map((question) => ({
        id: question.id,
        title: question.get('title'),
        complexity: question.get('complexity'),
        
      })); */
  
      return resultObj;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
}


export const fetchById = async(id) => {
  let parseQuery = new Parse.Query('questions');
  parseQuery.contains('objectId', id);
  let queryResults = await parseQuery.find();
  let res = queryResults[0];
  let details={
    title:res.get('title'),
    description:res.get('description'),
    complexity:res.get('complexity'),
    obj:res
  }
  return details;
}

export const submitCode = async(code, lang, user, question)=>{
    
    try {
      const query = new Parse.Query('submissions');
      query.equalTo('question_id', question);
      query.equalTo('user_id', user);
    
      const submissions = await query.find();
      
      // Process the retrieved submissions
      if (submissions.length) {
        alert("You have already submitted.");
        return false;
      } else {
        console.log("you are submitting now", question);
        const cleaned = qs.stringify(
          {'code':  code,
            'lang':  lang
          });
        console.log(cleaned);
        const obj = new Parse.Object('submissions');
        //console.log(user_id, question_id);
        obj.set('user_id', user);
        obj.set('question_id', question);
        obj.set('code', {codes: cleaned});
    
        // Make sure the function is marked as async to use 'await'
        await obj.save();
        return true;
        
      }
    } catch (error) {
      console.error('Error retrieving or saving submissions:', error);
    }
    //const parsed = qs.parse(cleaned);
    //const decodedCode = parsed.code;
}

export const getSubmissions = async (questionPointers) => {
  try {
    const query = new Parse.Query('submissions');
    
    // Assuming 'question_id' is the pointer column to the 'Question' class
    query.containedIn('question_id', questionPointers);

    const submissionsCountByQuestion = await query.count();

    console.log('Submissions count by question:', submissionsCountByQuestion);
    return submissionsCountByQuestion;
  } catch (error) {
    console.error('Error retrieving submissions count by question:', error);
    throw error;
  }
};

export const getUser = async (user_id) => {
  const parseQuery = new Parse.Query('_User');
    parseQuery.contains('objectId', user_id);
    let queryResults = await parseQuery.find();
    let user = queryResults[0];
    return user;
}

export const getSubByQues = async(ques) => {
  try{
    
    const query = new Parse.Query('submissions');
    let data = [];
    query.equalTo('question_id', ques);
    const submissions = await query.find();
    submissions.forEach((submission) => {
      let result = {};
      //let userObj = submission.get('user_id');
      result['id'] = submission.id;
      result['user'] = submission.get('user_id').id;
      //result['regno'] = userObj.get('username');
      //result['name'] = userObj.get('name');
      result['scored'] = submission.get('scored');
      const params = qs.parse(submission.get('code').codes);
      result['code'] = params.code;
      result['lang'] = params.lang;
      //result['code'] =decodeURIComponent(submission.get('code').codes).replace(/^code=/, '');
      //result['username'] = userObj.get('name');
      data.push(result);
    });

    return data;

  }catch(err){
    console.error('Error retrieving submissions:', err);
  }
}

const map_score = {
  'easy':200,
  'medium':400,
  'hard':600
}

export const addScore = async(subId, complexity) =>{
  const query = new Parse.Query('submissions');
  query.contains('objectId', subId);
  let queryResults = await query.find();
  let subObj = queryResults[0];
  if(subObj.get('scored')==true){
    return false;
  }else{
    console.log('finised first');
    let user= subObj.get('user_id');
    const q = new Parse.Query('scores');
    q.equalTo('user_id', user);
    const exists = await q.find();
    if(exists[0]){
      exists[0].increment('score', map_score[complexity]);
      await exists[0].save();
    }else{
      const newObj= new Parse.Object('scores');
      newObj.set('user_id', user);
      newObj.set('score', map_score[complexity]);
      newObj.set('username', user.get('username'));
      await newObj.save();
    }
    
    subObj.set('scored', true);
    await subObj.save();
    return true;
}

}

export const deleteScore = async(subId, complexity, user) =>{
  const query = new Parse.Query('scores');
  const q = new Parse.Query('submissions');
  query.contains('user_id', user);
  const result = await query.find();
  console.log(result);
  result[0].increment('score', -(map_score[complexity]));
  await result[0].save();
  q.contains('objectId', subId);
  const result2 = await q.find();
  const res = result2[0];
  res.set('scored', false);
  await res.save();
  return true
}

export const allScores = async() => {
  const query = new Parse.Query('scores');
  const results = await query.find();
  let data=[];
  results.forEach((result)=>{
    let res = {};
    res['user_id']= result.get('user_id').id;
    res['username'] = result.get('username');
    res['score'] = result.get('score');
    data.push(res);
  })
  return data;
}

export const Details = async(user_id) => {
  console.log(user_id);
    // const parseQuery = new Parse.Query('_User');
    // parseQuery.contains('objectId', user_id);
    // let queryResults = await parseQuery.find();
    // let user = queryResults[0];
    const query = new Parse.Query('submissions');
    query.contains('user_id', user_id);
    const results= await query.find();
    let data=[];
    results.forEach((result) => {
       let time = result.get('createdAt');
       let localTime = new Date(time).toLocaleString();
        data.push(localTime);
        
     })
    return data;

}