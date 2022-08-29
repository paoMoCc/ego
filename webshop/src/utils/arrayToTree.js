// 方法一

module.exports = function toTree(data){              
    let result = [];              
    let obj = {};              
    data.forEach(item => {                 
      obj[item.cateId] = Object.assign(item, obj[item.cateId] || {});                
      if (item.rootId) {                    
         let parent = obj[item.rootId] || {};        
         parent.child = parent.child || [];                     
         parent.child.push(item);                
         obj[item.rootId] = parent;                
      } else {                    
         result.push(obj[item.cateId])              
      }            
    })              
    return result;           
  }          

// 方法二

//module.exports = function toTree(data){             
//     let result = []            
//     //如果值是 Array，则为true; 否则为false。           
//     if(!Array.isArray(data)) {                  
//         return result       
//     }                
//     //根据父节点进行拼接子节点，             
//     data.forEach(item => {                
//       console.log(item);                
//       delete item.children; //已经有的话就删掉              
//     });               
//     //把每一项的引用放入map对象里             
//     let map = {};             
//     data.forEach(item => {                 
//          map[item.id] = item;          
//     });                
//     //再次遍历数组 决定item的去向             
//     data.forEach(item => {                
//       let parent = map[item.pid];                
//       if(parent) {                      
//        // 如果 map[item.pid] 有值 则 parent 为 item 的父级
//        // 判断 parent 里有无children 如果没有则创建 如果有则直接把 item push到children里  
//        (parent.children || (parent.children = [])).push(item);                 
//       } else {                 
//         // 如果 map[item.pid] 找不到值 说明此 item 为 第一级              
//         result.push(item);                  
//       }              
//     });  
//     return result;          
//  }            
 