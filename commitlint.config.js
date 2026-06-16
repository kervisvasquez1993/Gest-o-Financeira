module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],

    // Tipos permitidos para el backend
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

    'type-case': [2, 'always', 'lower-case'],   // tipo en minúscula
    'type-empty': [2, 'never'],                  // el tipo es obligatorio
    'scope-case': [2, 'always', 'lower-case'],   // scope en minúscula
    'subject-empty': [2, 'never'],               // descripción obligatoria
    'subject-full-stop': [2, 'never', '.'],      // sin punto final
  },
};