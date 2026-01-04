import { DataSource } from 'typeorm';

async function seedFamiliesAndSeverities() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'mes_db',
    username: process.env.DB_USER || 'mes_user',
    password: process.env.DB_PASSWORD || 'mes_password',
    entities: ['dist/**/*.entity.js'],
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    // Seed Severities (Severidades)
    const severities = [
      {
        code: 'CRITICAL',
        name: 'Crítico',
        description: 'Defecto crítico que impide el uso del producto',
        level: 5,
        color: '#dc3545',
        isActive: true,
      },
      {
        code: 'MAJOR',
        name: 'Mayor',
        description: 'Defecto importante que afecta significativamente la funcionalidad',
        level: 4,
        color: '#fd7e14',
        isActive: true,
      },
      {
        code: 'MODERATE',
        name: 'Moderado',
        description: 'Defecto moderado que puede afectar la funcionalidad',
        level: 3,
        color: '#ffc107',
        isActive: true,
      },
      {
        code: 'MINOR',
        name: 'Menor',
        description: 'Defecto menor que no afecta la funcionalidad principal',
        level: 2,
        color: '#28a745',
        isActive: true,
      },
      {
        code: 'COSMETIC',
        name: 'Cosmético',
        description: 'Defecto estético que no afecta la funcionalidad',
        level: 1,
        color: '#17a2b8',
        isActive: true,
      },
    ];

    console.log('\n📊 Insertando severidades...');
    for (const severity of severities) {
      await dataSource.query(
        `INSERT INTO quality_severities (code, name, description, level, color, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         ON CONFLICT (code) DO NOTHING`,
        [
          severity.code,
          severity.name,
          severity.description,
          severity.level,
          severity.color,
          severity.isActive,
        ]
      );
      console.log(`  ✓ ${severity.name} (${severity.code})`);
    }

    // Seed Defect Families (Familias de Defectos)
    const families = [
      {
        code: 'DIMENSIONAL',
        name: 'Dimensional',
        description: 'Defectos relacionados con medidas y dimensiones',
        isActive: true,
      },
      {
        code: 'VISUAL',
        name: 'Visual',
        description: 'Defectos de apariencia visual (rayones, manchas, etc.)',
        isActive: true,
      },
      {
        code: 'FUNCTIONAL',
        name: 'Funcional',
        description: 'Defectos que afectan el funcionamiento del producto',
        isActive: true,
      },
      {
        code: 'MATERIAL',
        name: 'Material',
        description: 'Defectos en el material o composición',
        isActive: true,
      },
      {
        code: 'ASSEMBLY',
        name: 'Ensamble',
        description: 'Defectos en el proceso de ensamblaje',
        isActive: true,
      },
      {
        code: 'PACKAGING',
        name: 'Empaque',
        description: 'Defectos en el empaque o embalaje',
        isActive: true,
      },
      {
        code: 'LABELING',
        name: 'Etiquetado',
        description: 'Defectos en etiquetas o marcado',
        isActive: true,
      },
      {
        code: 'CONTAMINATION',
        name: 'Contaminación',
        description: 'Presencia de contaminantes o cuerpos extraños',
        isActive: true,
      },
    ];

    console.log('\n📋 Insertando familias de defectos...');
    for (const family of families) {
      await dataSource.query(
        `INSERT INTO quality_defect_families (code, name, description, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (code) DO NOTHING`,
        [family.code, family.name, family.description, family.isActive]
      );
      console.log(`  ✓ ${family.name} (${family.code})`);
    }

    console.log('\n✅ Datos de severidades y familias cargados exitosamente\n');

    // Mostrar resumen
    const severityCount = await dataSource.query('SELECT COUNT(*) as count FROM quality_severities');
    const familyCount = await dataSource.query('SELECT COUNT(*) as count FROM quality_defect_families');
    
    console.log('📊 Resumen:');
    console.log(`   Severidades: ${severityCount[0].count}`);
    console.log(`   Familias: ${familyCount[0].count}\n`);

  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar seed
seedFamiliesAndSeverities()
  .then(() => {
    console.log('✅ Seed completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  });
