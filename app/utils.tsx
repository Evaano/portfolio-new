import { Text } from '@mantine/core';

type Skill = {
  name: string;
  level: string;
};

export const renderSkillsWithProgressBar = (skills: Skill[]) =>
  skills.map(skill => (
    <div key={skill.name} className="my-3">
      <div className="flex justify-between items-center mb-1">
        <Text size="sm">{skill.name}</Text>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`bg-pink-500 h-2.5 rounded-full ${skill.level}`}></div>
      </div>
    </div>
  ));
