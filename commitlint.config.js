module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'type-enum': [
      2,
      'always',
      [
        'feat',     
        'fix',      
        'refactor', 
        'perf',     
        'test',     
        'docs',     
        'chore',    
        'build',    
        'ci',      
        'style',    
        'revert',   
      ],
    ],

    'type-case': [2, 'always', 'lower-case'],   
    'type-empty': [2, 'never'],                  
    'scope-case': [2, 'always', 'lower-case'],  
    'subject-empty': [2, 'never'],               
    'subject-full-stop': [2, 'never', '.'],      
  },
};