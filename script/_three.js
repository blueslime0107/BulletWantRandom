
const ThreeTextures = {
    // stage1_bg1: { texture: 'stage/stage1/floor' },
    // stage1_sky: { texture: 'Bg1', crop: [0, 0, 540, 120] },
    // snowflake:  { texture: 'utility/snowflake' }
}

const _plainSegment = {
    name: "plain",
    segLen: 50,
    init: function () {
        const floorGeo = new THREE.PlaneGeometry(this.segLen, 120);
        const floorMat = new THREE.MeshBasicMaterial({
            map: ThreeTextures.stage1_bg1,
            side: THREE.DoubleSide
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(this.segLen * 0.5, 0, 0);
        this.group.add(floor);
    }
}

const ThreeBG = {
    stage1 : {
        scrollSpeed: 0.1,
        camPosition: { x: 0, y: 8.5, z: 0 },
        comRotation: { x: -76.6, y: -41.2, z: -72.2 },
        fogSetting: { color: '#61c8f5', near: 1, far: 30 },
        sky: "stage1_sky",
        skyRadius: 220,
        skyHeight: 80,
        skyY: 10,
        particles: {
            texture: 'snowflake',   // ThreeTextures의 키
            count: 200,             // 파티클 수
            size: 0.5,              // 파티클 크기
            spawnX: [5, 50],      // 초기 스폰 X 범위
            spawnY: [1, 24],        // 초기 스폰 Y 범위
            spawnZ: [-30, 0],      // 초기 스폰 Z 범위
            fallSpeed: [0.01, 0.05],     // Y 낙하 속도 (min/max, 파티클마다 다름)
            forwardSpeed: [0.01, 0.03],  // Z 전진 속도 (min/max)
            swayAmp: 0.02,          // X 흔들림 진폭
            rotationSpeed: [-0.03, 0.03], // 회전 속도 (min/max, 음수=시계방향)
            recycleY: -2,           // 이 Y 아래면 위에서 리스폰
            recycleZ: 55,           // 이 Z 넘으면 뒤로 리셋
            respawnY: [12, 24],     // Y 리스폰 위치 범위
        },
        segmentsData: {
            "plain": _plainSegment
        },
        initialSegments: ['plain']
    },
    forest: {
        scrollSpeed: 0.1,
        camPosition: { x: 0, y: 8.5, z: 0 },
        comRotation: { x: -76.6, y: -41.2, z: -72.2 },
        fogSetting: { color: '#61c8f5', near: 0, far: 30 },
        sky: "stage1_sky",
        skyRadius: 220,
        skyHeight: 80,
        skyY: 10,
        segmentsData: {
            "plain": _plainSegment,
            "plain2": {
                name: "plain2",
                segLen: 200,
                init: function () {
                    // ===== 바닥 =====
                    const floorGeo = new THREE.PlaneGeometry(this.segLen, 120);
                    const floorMat = new THREE.MeshBasicMaterial({
                        map: ThreeTextures.stage1_bg1,
                        side: THREE.DoubleSide
                    });
                    const floor = new THREE.Mesh(floorGeo, floorMat);
                    floor.rotation.x = -Math.PI / 2;
                    floor.position.set(this.segLen * 0.5, 0, 0);
                    this.group.add(floor);

                    // ===== 나무 =====
                    const treeCount = 100;          // 나무 개수

                    const trunkGeo = new THREE.CylinderGeometry(1.2, 1.5, 30, 8);
                    const trunkMat = new THREE.MeshBasicMaterial({
                        color: 0x6b4a2b // 갈색
                    });

                    for (let i = 0; i < treeCount; i++) {
                        const trunk = new THREE.Mesh(trunkGeo, trunkMat);

                        // 바닥 범위 내 랜덤 배치
                        const x = getRandom(1, this.segLen);
                        const z = getRandom(-50, -20) + (i % 2 === 0 ? 0 : 70)

                        trunk.position.set(x, 9, z); // y는 높이/2
                        trunk.rotation.y = Math.random() * Math.PI * 2;

                        this.group.add(trunk);
                    }
                }
            }
        },
        initialSegments: ['plain']
    }
}