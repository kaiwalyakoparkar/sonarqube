/*
 * SonarQube
 * Copyright (C) 2009-2023 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import styled from '@emotion/styled';
import tw from 'twin.macro';
import { themeBorder, themeColor, themeContrast, themeShadow } from '../helpers';
import { CheckIcon } from './icons';

interface Props {
  disabled?: boolean;
  labels: {
    off: string;
    on: string;
  };
  name?: string;
  onChange?: (value: boolean) => void;
  value: boolean | string;
}

const getValue = (value: boolean | string) => {
  return typeof value === 'string' ? value === 'true' : value;
};

export function Switch(props: Readonly<Props>) {
  const { disabled, onChange, name, labels } = props;
  const value = getValue(props.value);

  const handleClick = () => {
    if (!disabled && onChange) {
      const value = getValue(props.value);
      onChange(!value);
    }
  };

  return (
    <StyledSwitch
      active={value}
      aria-checked={value}
      aria-label={value ? labels.on : labels.off}
      disabled={disabled}
      name={name}
      onClick={handleClick}
      role="switch"
      type="button"
    >
      <CheckIconContainer active={value} disabled={disabled}>
        {value && <CheckIcon fill="currentColor" />}
      </CheckIconContainer>
    </StyledSwitch>
  );
}

interface StyledProps {
  active: boolean;
  disabled?: boolean;
}

const CheckIconContainer = styled.div<StyledProps>`
  ${tw`sw-rounded-pill`}
  ${tw`sw-flex sw-items-center sw-justify-center`}
  ${tw`sw-w-4 sw-h-4`}
  color: ${({ disabled }) =>
    disabled ? themeContrast('switchButtonDisabled') : themeContrast('switchButton')};
  background: ${({ disabled }) =>
    disabled ? themeColor('switchButtonDisabled') : themeColor('switchButton')};
  border: none;
  box-shadow: ${themeShadow('xs')};
  transform: ${({ active }) => (active ? 'translateX(1rem)' : 'translateX(0)')};
  cursor: inherit;
  transition: transform 0.3s ease;
`;

const StyledSwitch = styled.button<StyledProps>`
  ${tw`sw-flex sw-flex-row`}
  ${tw`sw-rounded-pill`}
  ${tw`sw-p-1/2`}
  ${tw`sw-cursor-pointer`}
  width: 2.25rem;
  height: 1.25rem;
  background: ${({ active }) => (active ? themeColor('switchActive') : themeColor('switch'))};
  border: none;
  transition: 0.3s ease;
  transition-property: background, outline;

  &:hover:not(:disabled),
  &:active:not(:disabled),
  &:focus:not(:disabled) {
    background: ${({ active }) =>
      active ? themeColor('switchHoverActive') : themeColor('switchHover')};
    ${CheckIconContainer} {
      color: ${themeContrast('switchHover')};
    }
  }

  &:disabled {
    background: ${themeColor('switchDisabled')};
  }

  &:focus:not(:disabled),
  &:active:not(:disabled) {
    outline: ${({ active }) =>
      active ? themeBorder('focus', 'switchActive') : themeBorder('focus', 'switch')};
  }
`;
