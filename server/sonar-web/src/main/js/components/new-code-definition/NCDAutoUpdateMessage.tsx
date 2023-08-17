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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { MessageTypes, checkMessageDismissed, setMessageDismissed } from '../../api/messages';
import { getNewCodePeriod } from '../../api/newCodePeriod';
import { CurrentUserContextInterface } from '../../app/components/current-user/CurrentUserContext';
import withCurrentUserContext from '../../app/components/current-user/withCurrentUserContext';
import { NEW_CODE_PERIOD_CATEGORY } from '../../apps/settings/constants';
import { queryToSearch } from '../../helpers/urls';
import { Component } from '../../types/types';
import Link from '../common/Link';
import DismissableAlertComponent from '../ui/DismissableAlertComponent';
import {
  PreviouslyNonCompliantNCD,
  isGlobalOrProjectAdmin,
  isPreviouslyNonCompliantDaysNCD,
} from './utils';

interface NCDAutoUpdateMessageProps extends Pick<CurrentUserContextInterface, 'currentUser'> {
  component?: Component;
}

function NCDAutoUpdateMessage(props: NCDAutoUpdateMessageProps) {
  const { component, currentUser } = props;
  const isGlobalBanner = component === undefined;
  const intl = useIntl();

  const [dismissed, setDismissed] = useState(true);
  const [previouslyNonCompliantNewCodeDefinition, setPreviouslyNonCompliantNewCodeDefinition] =
    useState<PreviouslyNonCompliantNCD | undefined>(undefined);

  const isAdmin = useMemo(
    () => isGlobalOrProjectAdmin(currentUser, component),
    [component, currentUser]
  );
  const ncdReviewLinkTo = useMemo(
    () =>
      isGlobalBanner
        ? {
            pathname: '/admin/settings',
            search: queryToSearch({
              category: NEW_CODE_PERIOD_CATEGORY,
            }),
          }
        : {
            pathname: '/project/baseline',
            search: queryToSearch({
              id: component.key,
            }),
          },
    [component, isGlobalBanner]
  );

  const handleBannerDismiss = useCallback(async () => {
    await setMessageDismissed(
      isGlobalBanner
        ? { messageType: MessageTypes.GlobalNcd90 }
        : { messageType: MessageTypes.ProjectNcd90, projectKey: component.key }
    );
    setDismissed(true);
  }, [component, isGlobalBanner]);

  useEffect(() => {
    async function fetchNewCodeDefinition() {
      const newCodeDefinition = await getNewCodePeriod(
        component && {
          project: component.key,
        }
      );

      if (
        isPreviouslyNonCompliantDaysNCD(newCodeDefinition) &&
        (!component || !newCodeDefinition?.inherited)
      ) {
        setPreviouslyNonCompliantNewCodeDefinition(newCodeDefinition);

        const messageStatus = await checkMessageDismissed(
          isGlobalBanner
            ? {
                messageType: MessageTypes.GlobalNcd90,
              }
            : {
                messageType: MessageTypes.ProjectNcd90,
                projectKey: component.key,
              }
        );

        setDismissed(messageStatus.dismissed);
      }
    }

    if (isAdmin) {
      fetchNewCodeDefinition();
    }
  }, [isAdmin, component, isGlobalBanner]);

  if (!isAdmin || dismissed || !previouslyNonCompliantNewCodeDefinition) {
    return null;
  }

  const { updatedAt, previousNonCompliantValue, value } = previouslyNonCompliantNewCodeDefinition;
  const bannerMessageId = isGlobalBanner
    ? 'new_code_definition.auto_update.global.message'
    : 'new_code_definition.auto_update.project.message';

  return (
    <DismissableAlertComponent onDismiss={handleBannerDismiss} variant="info" display="banner">
      <FormattedMessage
        id={bannerMessageId}
        values={{
          date: new Date(updatedAt).toLocaleDateString(),
          days: value,
          link: (
            <Link to={ncdReviewLinkTo}>
              {intl.formatMessage({ id: 'new_code_definition.auto_update.review_link' })}
            </Link>
          ),
          previousDays: previousNonCompliantValue,
        }}
      />
    </DismissableAlertComponent>
  );
}

export default withCurrentUserContext(NCDAutoUpdateMessage);